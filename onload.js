const buttons = [
    {
        "href" : "lilithdev.neocities.org",
        "img" : "ningenshikkakubotan.png",
    },
    {
        "href" : "lilithdev.neocities.org",
        "img" : "lilithdevbtn.gif",
    },
    {
        "href" : "specifix.dev",
        "img" : "88x31.png",
    },
    {
        "href" : "pixelde.su",
        "img" : "pixeldesu.png",
    },
];

const contacts = {
    social: [
        {
            href: "https://bsky.app/profile/pufikas.bsky.social",
            webName: "Bluesky",
            username: "@Pufikas",
            svg: {
                xmlns: "http://www.w3.org/2000/svg",
                path: "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565C.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479c.815 2.736 3.713 3.66 6.383 3.364q.204-.03.415-.056q-.207.033-.415.056c-3.912.58-7.387 2.005-2.83 7.078c5.013 5.19 6.87-1.113 7.823-4.308c.953 3.195 2.05 9.271 7.733 4.308c4.267-4.308 1.172-6.498-2.74-7.078a9 9 0 0 1-.415-.056q.21.026.415.056c2.67.297 5.568-.628 6.383-3.364c.246-.828.624-5.79.624-6.478c0-.69-.139-1.861-.902-2.206c-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8",
            }
        },
        {
            href: "https://steamcommunity.com/id/Pufikas",
            webName: "Steam",
            username: "Pufikas",
            svg: {
                xmlns: "http://www.w3.org/2000/svg",
                path: "M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658a3.4 3.4 0 0 1 1.912-.59q.094.001.188.006l2.861-4.142V8.91a4.53 4.53 0 0 1 4.524-4.524c2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911l.004.159a3.39 3.39 0 0 1-3.39 3.396a3.41 3.41 0 0 1-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0M7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25a2.551 2.551 0 0 0 3.337-3.324a2.547 2.547 0 0 0-3.255-1.413l1.523.63a1.878 1.878 0 0 1-1.445 3.467zm11.415-9.303a3.02 3.02 0 0 0-3.015-3.015a3.015 3.015 0 1 0 3.015 3.015m-5.273-.005a2.264 2.264 0 1 1 4.531 0a2.267 2.267 0 0 1-2.266 2.265a2.264 2.264 0 0 1-2.265-2.265",
            }
        },
        {
            href: "https://github.com/Pufikas",
            webName: "GitHub",
            username: "Pufikas",
            svg: {
                xmlns: "http://www.w3.org/2000/svg",
                path: "M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
            }
        }
    ],
    gaming: [
        {
            href: "https://osu.ppy.sh/users/12139027",
            webName: "osu!",
            username: "PufikasLTu",
            svg: {
                xmlns: "",
                path: "",
            }
        },
        {
            href: "https://forums.warframe.com/profile/4811917-k-pufikas/",
            webName: "Warframe",
            username: "--K--Pufikas",
            svg: {
                xmlns: "",
                path: "",
            }
        },
    ]
};

let templates = [
    {
        "href" : "",
        "img" : "",
    },

    {
        href: "",
        webName: "",
        username: "",
        svg: {
            xmlns: "",
            path: "",
        }
    },
]



let buttonList = document.getElementById("buttonList");

function loadStuff() {
    initButtons();
    Object.entries(contacts).forEach(([section, sectionContacts]) => {
        initContacts(section, sectionContacts);
    });
};

function initButtons() {
    let html = '';

    buttons.forEach(e => {
        html += ` 
        <a target="_blank" rel="nofollow" href="https://${e.href}">
            <img src="./assets/buttons/${e.img}"/>
        </a>`;
    });
    
    buttonList.innerHTML = html;
};

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

loadStuff();