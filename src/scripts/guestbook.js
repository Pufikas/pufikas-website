const form = document.getElementById("guestbook");
const submitbtn = document.getElementById("submitbtn");

let messagesPerPage = 10;
let gbCurrPage = 1;
let gbTotalPages = 0;

let gbLoaded = false;
const emojis = [
    "steambored.png",
    "steamhappy.png",
    "steammocking.png",
    "steamthumbsdown.png",
    "steamthumbsup.png",
    "miku_comfy.png",
    "miku_hello.png",
    "miku_love.png",
    "miku_smirk.png"
];
const emojiSet = new Set(emojis.map(file => file.replace(/\.[^.]+$/, "")));
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

if (location.hash.startsWith("#guestbook")) {
    fetchGuestbook();
}

function renderGBPageButtons() {
    const start = (gbCurrPage - 1) * messagesPerPage;
    const end = start + messagesPerPage;
    const msgs = messageList.slice(start, end);
    const board = document.getElementById("guestbookMessages");

    board.innerHTML = "";
    gbTotalPages = Math.max(1, Math.ceil(messageList.length / messagesPerPage));

    messageList.slice(start, end)
        .forEach(createMessageElement);

    document.getElementById("guestbookPageIndicator").textContent = `${gbCurrPage} / ${gbTotalPages}`;
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

document.getElementById("emojisBtn").onclick = () => {
    document.getElementById("emojiPanel").classList.toggle("hidden");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        username: document.getElementById("name").value,
        message: document.getElementById("message").value,
        website: document.getElementById("website").value,
        q1: document.getElementById("q1").value,
        q2: document.getElementById("q2").value,
        q3: document.getElementById("q3").value
    };

    if (!body.message) {
        alert("Write a message first!");
        return;
    }

    submitbtn.disabled = true;
    submitbtn.textContent = "Sending...";

    const res = await fetch("https://pufikasapistuff.netlify.app/.netlify/functions/guestbook", {
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

async function fetchGuestbook() {
    if (gbLoaded) return;
    
    await fetch("https://pufikasapistuff.netlify.app/.netlify/functions/guestbook_messages")
        .then(res => res.json())
        .then(data => {
            generateEmojiPanel(emojis)
            messageList = data.messages;
            gbLoaded = true;
            renderGBPageButtons();
        }).catch(err => console.error("failed to fetch guestbook messages", err));
}

function generateEmojiPanel(emojis) {
    const panel = document.getElementById("emojiPanel");

    emojis.forEach(e => {
        const button = document.createElement("button");
        button.className = "emojiButton";
        button.type = "button";

        const img = document.createElement("img");
        img.src = `assets/emoji/${e}`;
        img.alt = e.substring(0, e.lastIndexOf(".")); // keeps the clean name of emoji without the extension name
        img.classList.add("bigEmoji")
        
        button.append(img);

        button.onclick = () => {
            insertEmoji(e.substring(0, e.lastIndexOf(".")));
        };

        panel.append(button);
    });
}

function insertEmoji(emoji) {
    const textarea = document.getElementById("message");
    const shortcode = `:${emoji}:`;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    textarea.setRangeText(shortcode, start, end, "end");

    document.getElementById("emojiPanel").classList.toggle("hidden");
    textarea.focus();
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
    renderMessage(m.message, mMessage);
    
    // show reply if there is one
    if (m.reply) {
        const mReplyBox = document.createElement("div");
        mReplyBox.className = "msgReplyBox";

        const mReplyName = document.createElement("span");
        mReplyName.textContent = "Pufikas";
        mReplyName.className = "usernameBox";
        mReplyName.style.setProperty("--hue", 326);

        const mUpper = document.createElement("div");
        mUpper.className = "msgUpper";
        mUpper.style.setProperty("--hue", 326);

        const mReplyTime = document.createElement("span");
        mReplyTime.className = "msgReplyTime";
        mReplyTime.textContent = new Date(m.reply_date).toLocaleString("lt-LT");

        const mReply = document.createElement("p");
        mReply.className = "msgReplyText";
        renderMessage(m.reply, mReply);
        
        mUpper.append(mReplyName, mReplyTime);
        mReplyBox.append(mUpper, mReply);
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

// looks for a regex like :text: and if it finds that it tries to render the image from it from an emojiSet (if doesnt exists keeps it :text:)
function renderMessage(message, container) {
    const regex = /:([a-zA-Z0-9_-]+):/g; // looks for :text:
    let lastIndex = 0; // track message text index
    let match;
    
    while ((match = regex.exec(message)) !== null) {
        // load all the text before the emoji match index
        if (match.index > lastIndex) {
            container.append(
                document.createTextNode(message.slice(lastIndex, match.index)) // (Hello :emoji: testing => Hello )
            );
        }

        // append the emoji to the container (if it exists in emojiSet)
        if (emojiSet.has(match[1])) { // match[1] is cat, match[0] is :cat:
            const img = document.createElement("img");
            img.className = "emoji";
            img.src = `assets/emoji/${match[1]}.png`;
            img.alt = match[1];

            container.append(img);
        } else {
            container.append(document.createTextNode(match[0]));
        }

        lastIndex = regex.lastIndex;
    }

    // load remaining of the message
    if (lastIndex < message.length) {
        container.append(
            document.createTextNode(message.slice(lastIndex))
        );
    }
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