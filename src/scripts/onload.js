/* how contact looks like
<section id="social">
    <h2>SOCIALS</h2>
    <div class="grid-cols-2">
        <a href="https://bsky.app/profile/pufikas.bsky.social" target="_blank" class="flex contact nohover">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565C.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479c.815 2.736 3.713 3.66 6.383 3.364q.204-.03.415-.056q-.207.033-.415.056c-3.912.58-7.387 2.005-2.83 7.078c5.013 5.19 6.87-1.113 7.823-4.308c.953 3.195 2.05 9.271 7.733 4.308c4.267-4.308 1.172-6.498-2.74-7.078a9 9 0 0 1-.415-.056q.21.026.415.056c2.67.297 5.568-.628 6.383-3.364c.246-.828.624-5.79.624-6.478c0-.69-.139-1.861-.902-2.206c-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8"/></svg>
            
            <div class="pl10">
                <span class="block contactName">Bluesky</span>
                <span class="block contactHandle">@Pufikas</span>
            </div>
        </a>
    </div>
</section>
*/

let buttonList = document.getElementById("buttonList");
let buttons = [];
const pageCache = {};
let contacts = [];
let bootText = [
    `[  !!  ] == CLICK ANYWHERE TO SKIP THIS ==
[  II  ] Current Operating System: Linux void 6.12.41_1`,
    `         Markers: (!!) notice, (II) informational,
         (WW) warning, (EE) error, (??) unknown.`,
    "[  II  ] Mounting pseudo-filesystems...",
    "         Loading kernel modules...",
    `[  !!  ] Before reporting problems, check https://github.com/Pufikas/pufikas-website       
         to make sure that you have the latest version`,
    "[  II  ] Checking filesystems...",
    "[  OK  ] Finished Load Kernel Modules",
    `         Initializing swap...
         Initializing random seed...`,
    `[  II  ] Starting udev daemon...
[  OK  ] Udev daemon running`,
    "[  II  ] Bringing up loopback interface...",
    `[  OK  ] lo interface up
[  II  ] Bringing up network interface eth0...`,
    "[  OK  ] eth0 connected at 195.142.1.45",
    "[  II  ] LoadModule: 'nv'",
    "[  WW  ] Warning, couldn't open module nv",
    "[  EE  ] Failed to load module 'nv' (module does not exist, 0)",
    "         Starting Apply Kernel Variables...",
    "[  OK  ] Finished Load Kernel Variables",
    "[  II  ] Starting Display Manager...",
    "         pufikas login",
    "         Password: *******",
    "[  EE  ] Incorrect password, booting as guest",
];

let currPage = 1;
let totalPages = 0;
const itemsPerPage = 6; // 2 cols and 3 each col

fetch("src/data/data.json")
    .then(res => res.json())
    .then(data => {
        buttons = data.buttons;
        contacts = data.contacts;
        loadStuff();
    })
    .catch(err => console.error("no songs loaded", err));

fetch("https://api.github.com/repos/Pufikas/pufikas-website/commits/main")
    .then(res => res.json())
    .then(data => {
        const date = new Date(data.commit.committer.date);
        document.getElementById("lastupdate").textContent = date.toISOString().split("T")[0];
        document.getElementById("lastupdate-message").textContent = data.commit.message;
    });

async function loadStuff() {
    initLoadEffect();
    // initButtons();
    renderPageButtons()
    Object.entries(contacts).forEach(([section, sectionContacts]) => {
        initContacts(section, sectionContacts);
    });
};

// function initButtons() {
//     let html = '';

//     buttons.forEach(e => {
//         html += ` 
//         <a target="_blank" rel="nofollow noopener noreferrer" href="https://${e.href}">
//             <img src="./assets/buttons/${e.img}"/>
//         </a>`;
//     });
//     buttonList.innerHTML = html;
//     renderPage();
// };

function renderPageButtons() {
    const start = (currPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const btns = buttons.slice(start, end);
    totalPages = Math.ceil(buttons.length / itemsPerPage);

    // cache buttons
    if (!pageCache[currPage]) {
        const html = btns.map(e => `
            <a target="_blank" rel="nofollow noopener noreferrer" href="https://${e.href}">
                <img src="./assets/buttons/${e.img}" />
            </a>`
        ).join('');

        pageCache[currPage] = html;
    }

    buttonList.classList.add('slide-out-left');

    // animations when changing button page
    setTimeout(() => {
        buttonList.innerHTML = pageCache[currPage];

        buttonList.classList.remove('slide-out-left');
        buttonList.classList.add('slide-in-right');

        setTimeout(() => buttonList.classList.remove('slide-in-right'), 300);
    }, 400)
    
    document.getElementById('pageIndicator').textContent = `${currPage} / ${totalPages}`;
}

function createContact(e) {
    const a = document.createElement("a");
        a.href = e.href;
        a.target = "_blank";
        a.className = "flex contact";

    
    const svg = document.createElementNS(e.svg.xmlns, "svg");
        svg.setAttribute("xmlns", e.svg.xmlns);
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", 32);
        svg.setAttribute("height", 32);

    const path = document.createElementNS(e.svg.xmlns, "path");
        path.setAttribute("fill", "currentColor");
        path.setAttribute("d", e.svg.path);
    
    svg.appendChild(path);
    a.appendChild(svg);
    

    const div = document.createElement("div");
        div.className = "pl10";

    const ctName = document.createElement("span");
        ctName.className = "block contactName";
        ctName.textContent = e.webName;

    const ctHandle = document.createElement("span");
        ctHandle.className = "block contactHandle";
        ctHandle.textContent = e.username;

    div.appendChild(ctName);
    div.appendChild(ctHandle);
    a.appendChild(div)

    return a;
};

function initContacts(sectionId, data) {
    const section = document.getElementById(sectionId);
    const container = document.createElement("div");
        container.className = "grid-cols-2";

    data.forEach(contact => 
        container.appendChild(createContact(contact))
    );

    section.appendChild(container);
}

function initLoadEffect() {
    const splash = document.querySelector(".splash");

    bootText.forEach((line, i) => {
        setTimeout(() => {
            const p = document.createElement("p");

            const markers = {
                "  OK  " : "ok",
                "  WW  " : "ww",
                "  EE  " : "fail",
                "  !!  " : "fail"
            };

            for (const marker in markers) {
                if (line.includes(marker)) {
                    p.innerHTML = line.replace(marker, `<span class="${markers[marker]}">${marker}</span>`);
                    break;
                }
            }
            
            if (!p.innerHTML) {
                p.textContent = line;
            }
            splash.append(p);
        }, i * 100 + Math.random() * 100 + (line.includes("Incorrect") ? 300 : 0))
    });;
    
    setTimeout(() => {
        splash.style.opacity = 0;
        splash.classList.add("hidden");
    }, bootText.length * 190);

    splash.addEventListener("click", () => {
        splash.style.opacity = 0.2;
        splash.textContent = "User input detected Quitting"

        setTimeout(() => {
            splash.classList.add("hidden");
        }, 620)
    })
}

