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
    // {
    //     "href" : "",
    //     "img" : "",
    // },
    // {
    //     "href" : "",
    //     "img" : "",
    // },
    // {
    //     "href" : "",
    //     "img" : "",
    // },
    // {
    //     "href" : "",
    //     "img" : "",
    // },
    // {
    //     "href" : "",
    //     "img" : "",
    // },
    // {
    //     "href" : "",
    //     "img" : "",
    // },
];

let buttonList = document.getElementById("buttonList");

function loadStuff() {
    initButtons();
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

function initContacts() {
    
}

loadStuff();