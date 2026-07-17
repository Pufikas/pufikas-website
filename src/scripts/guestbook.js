const form = document.getElementById("guestbook");
const submitbtn = document.getElementById("submitbtn");

let messagesPerPage = 10;
let gbCurrPage = 1;
let gbTotalPages = 0;

let messageList = [];
// q1 is not typed here because it's the color input, we don't need to render a question label for that
let questions = [
    {
        key: "q2",
        label: "How did you find me?"
    },
    {
        key: "q3",
        label: "Favorite musician/music?"
    },
];


function renderGBPageButtons() {
    const start = (gbCurrPage - 1) * messagesPerPage;
    const end = start + messagesPerPage;
    const msgs = messageList.slice(start, end);
    const board = document.getElementById("guestbookMessages");

    board.innerHTML = "";
    gbTotalPages = Math.max(1, Math.ceil(messageList.length / messagesPerPage));

    messageList.slice(start, end)
        .forEach(createMessageElement);

    document.getElementById("pageIndicator").textContent = `${gbCurrPage} / ${gbTotalPages}`;
}

document.getElementById("guestbookPrevBtn").onclick = () => {
    if (gbCurrPage > 1) {
        gbCurrPage--;
    } else {
        gbCurrPage = gbTotalPages;
    }
    renderGBPageButtons();
};

document.getElementById("guestbookNextBtn").onclick = () => {
    if (gbCurrPage < gbTotalPages) {
        gbCurrPage++;
    } else {
        gbCurrPage = 1;
    }
    renderGBPageButtons();
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitbtn.disabled = true;
    submitbtn.textContent = "Sending...";

    const body = {
        username: document.getElementById("name").value,
        message: document.getElementById("message").value,
        website: document.getElementById("website").value,
        q1: document.getElementById("q1").value,
        q2: document.getElementById("q2").value,
        q3: document.getElementById("q3").value
    };

    const res = await fetch("http://localhost:8888/.netlify/functions/guestbook", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    submitbtn.disabled = false;
    submitbtn.textContent = "Send";

    if (data.success) {
        form.reset();
        alert("Message received! It will show here when it's approved!");
    } else {
        alert(data.error);
    }
});

function fetchGuestbook() {
    fetch("http://localhost:8888/.netlify/functions/guestbook_messages")
        .then(res => res.json())
        .then(data => {
            messageList = data.messages;
            console.log("data", messageList)
            renderPageButtons();
        }).catch(err => console.error("failed to fetch guestbook messages", err));
}

function createQuestionElement(m, q) {
    const answer = m[q.key];

    if (!answer)
        return null;
    
    const row = document.createElement("div");
    row.className = "msgQuestion";

    const label = document.createElement("strong");
    label.textContent = q.label + ": ";

    const value = document.createElement("span");
    value.className = "msgAnswer";
    value.textContent = answer;

    row.append(label, value);

    return row;
}

function createMessageElement(m) {
    const board = document.getElementById("guestbookMessages");
    let questionBox = null;
    const { h } = hexToHsl(m.q1);

    // box wrap for the message
    const mBox = document.createElement("div");
    mBox.className = "msgBox";

    // upper content of the box (name, date)
    const mUpper = document.createElement("div");
    mUpper.className = "msgUpper";
    mUpper.style.setProperty("--hue", h);

    const mUser = document.createElement(m.website ? "a" : "span");
    mUser.textContent = m.username;
    mUser.className = "usernameBox";
    mUser.style.setProperty("--hue", h);

    if (m.website) {
        mUser.href = m.website;
        mUser.target = "_blank";
        mUser.rel = "noopener noreferrer";
    }

    mUpper.append(mUser);
    
    // user answered questions (if any)
    questions.forEach(q => {
        const element = createQuestionElement(m, q);

        if (!element) return;

        if (!questionBox) {
            questionBox = document.createElement("div");
            questionBox.className = "msgQuestions";
        }

        questionBox.append(element);
    });


    const mTime = document.createElement("span");
    mTime.textContent = new Date(m.created_at).toLocaleString("lt-LT"); 
    mTime.className = "userTime";

    const mMessage = document.createElement("div");
    mMessage.className = "msgText";
    mMessage.textContent = m.message;
    
    // show reply if there is one
    if (m.reply) {
        const mReplyBox = document.createElement("div");
        mReplyBox.className = "msgReplyBox";

        const mReplyName = document.createElement("span");
        mReplyName.textContent = "Pufikas";
        mReplyName.className = "usernameBox";
        mReplyName.style.setProperty("--hue", 326);

        const mReplyHeader = document.createElement("div");
        mReplyHeader.className = "msgReplyHeader";

        const mReplyTime = document.createElement("span");
        mReplyTime.className = "msgReplyTime";
        mReplyTime.textContent = new Date(m.reply_date).toLocaleString("lt-LT");

        const mReply = document.createElement("p");
        mReply.className = "msgReplyText";
        mReply.textContent = m.reply;

        mReplyHeader.append(mReplyName, mReplyTime);
        mReplyBox.append(mReplyHeader, mReply);
        mMessage.append(mReplyBox);
    }

    mBox.append(mUpper)
    mUpper.append(mTime);
    if (questionBox) {
        mBox.append(questionBox);
    }
    mBox.append(mMessage)
    board.append(mBox);
}

function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h *= 60;
    }

    return {
        h,
        s: s * 100,
        l: l * 100
    };
}

fetchGuestbook();