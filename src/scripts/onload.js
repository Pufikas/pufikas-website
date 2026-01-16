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

let hourly = {};
let daily = {};
let buttonList = document.getElementById("buttonList");
let songs = [];
let buttons = [];
let blogs = [];
let settings = {};
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
let dailyYesterday = {};
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

fetch("src/blogs/blogs.json")
    .then(res => res.json())
    .then(data => {
        loadBlogs(data);       
    }).catch(err => console.error("fetch failed for blogs", err));

fetch("src/data/data.json")
    .then(res => res.json())
    .then(data => {
        buttons = data.buttons;
        contacts = data.contacts;
        songs = data.songs;
        settings = data.settings;
        loadStuff();
    }).catch(err => console.error("fetch failed for data: ", err));

fetch("src/data/stats.json")
    .then(res => res.json())
    .then(data => {
        hourly = data.hourly;
        daily = data.daily;
        dailyYesterday = data.daily[yesterday.toISOString().split("T")[0]]
        updateSiteStats();
    }).catch(err => console.error("fetch failed for website stats: ", err));

function updateSiteStats() {
    const url = "https://github.com/Pufikas/pufikas-website/commit/";
    const container = document.getElementById("lastupdate-message");
    const link = document.createElement('a');
        link.className = 'nn not-smaller';
        link.href = `${url}/${hourly.code_sha}`;
        link.target = '_blank';
        link.rel = 'nofollow';
        link.textContent = "„" + hourly.code_message + "”";

    document.getElementById("lastupdate").textContent = hourly.generated_at.split("T")[0];
    document.getElementById("lastupdate-additions").textContent = hourly.code_additions + "+" || 0;
    document.getElementById("lastupdate-deletions").textContent = hourly.code_deletions + "-" || 0;
    container.innerHTML = '';
    container.appendChild(link);

    websiteStats();
}

function websiteStats() {
    let upd = document.getElementById("nekoweb-updates");
    let fol = document.getElementById("nekoweb-followers");
    let vie = document.getElementById("nekoweb-views");
    let upd2 = document.getElementById("nekoweb-updates-before");
    let fol2 = document.getElementById("nekoweb-followers-before");
    let vie2 = document.getElementById("nekoweb-views-before");

    setStat(vie, "booted ", hourly.views, " times", "ok");
    setStat(fol, "installed by ", hourly.followers, " users", "ok");
    setStat(upd, "deployed ", hourly.site_updates, " times", "ok");

    applyDiff(fol2, hourly.followers, dailyYesterday.followers);
    applyDiff(vie2, hourly.views, dailyYesterday.views);
    applyDiff(upd2, hourly.site_updates, dailyYesterday.site_updates);
}


function compareStat(today, yesterday) {
    if (yesterday == null) {
        return { text: "no data", class: "nn" };
    }

    const diff = today - yesterday;

    if (diff > 0) {
        return { text: `+${diff} today`, class: "ok" };
    }

    if (diff < 0) {
        return { text: `-${Math.abs(diff)} today.`, class: "ww" };
    }

    return { text: "no change", class: "nn" };
}

function applyDiff(el, today, yesterday) {
    const diff = compareStat(today, yesterday);
    el.textContent = diff.text;
    el.classList.remove("ok", "ww", "nn");
    el.classList.add(diff.class);
}

function setStat(el, before, value, after, name_class) {
    el.textContent = before;
    const span = document.createElement("span");
    span.className = name_class;
    span.textContent = value;
    el.append(span, after);
}

async function loadStuff() {
    initLoadEffect();
    renderPageButtons();
    loadSongEventListeners();
    loadPageFromUrl();
    loadLocalStorage();

    Object.entries(contacts).forEach(([section, sectionContacts]) => {
        initContacts(section, sectionContacts);
    });
};

function loadSongEventListeners() {
    audio.volume = 0.2;
    volumeLine.style.width = "20%";

    audio.src = `${musicPath}${songs[0].song}`;
    audioCover.src = `${musicPath}${songs[0].cover}`;
    audioTitle.textContent = `${musicPath}${songs[0].title}`;
    audioAuthor.textContent = `${musicPath}${songs[0].author}`;
    
    audio.addEventListener("loadedmetadata", () => {
        document.getElementById("audio-total").textContent = formatTime(audio.duration);
        document.getElementById("audio-title").textContent = songs[counter].title;
        document.getElementById("audio-author").textContent = songs[counter].author;
    });
    
    audio.addEventListener("timeupdate", () => {
        document.getElementById("audio-duration").textContent = formatTime(audio.currentTime);
        const progress = (audio.currentTime / audio.duration) * 100;
        line.style.width = `${progress}%`;
        
        // pauses completly on music end
        // if (line.style.width == "100%") {
        //     audioPlay.innerText = "▶";
        //     audio.pause();
        // }
    });
    
    audio.addEventListener("ended", () => {
        audioPlayNext(1); 
    });

    audioVolume.addEventListener("click", changeVolume);
    audioPlay.addEventListener("click", playAudio);
    audioProgress.addEventListener("click", seekIntoMusic.bind(this));
    document.getElementById("audio-play-next").addEventListener("click", () => audioPlayNext(1));
    document.getElementById("audio-play-previous").addEventListener("click", () => audioPlayNext(-1));
}

function loadBlogs(blogs) {
    let container = document.getElementById("blog-container");

    for (let i = 0; i < blogs.length; i++) {
        const bCard = document.createElement("div");
            bCard.className = "box blogCard";
            bCard.id = blogs[i].id;

        const bDetails = document.createElement("div");
            bDetails.className = "blogDetails";

        const bTitle = document.createElement("h2");
            bTitle.innerText = blogs[i].title;
            bTitle.className = "blogTitle"
        
        const bTags = document.createElement("span");
            bTags.className = "blogTags"

        const bIntro = document.createElement("p");
            bIntro.innerText = blogs[i].intro
            bIntro.className = "blogIntro"

        const bArticle = document.createElement("div");
            bArticle.className = "blogArticle"

        const bDate = document.createElement("span");
            bDate.innerText = new Date(blogs[i].date).toLocaleString();
        
        const bId = document.createElement("span");
            bId.innerText = blogs[i].id;

        const bArrow = document.createElement("button");
            bArrow.innerText = "▶ ▶ ▶"
            bArrow.className = "blogToggle center"
        
        bCard.appendChild(bDetails);
        bCard.appendChild(bTitle);
        bCard.appendChild(bTags);
        bCard.appendChild(bIntro);
        bCard.appendChild(bArticle);
        bCard.appendChild(bArrow);

        bCard.dataset.blogId = blogs[i].id;
        bCard.dataset.blogFile = blogs[i].file;

        bDetails.appendChild(bDate);
        bDetails.appendChild(bId);
        document.getElementById("blogCount").innerText = blogs.length;
        bArrow.addEventListener("click", expandBlog);

        container.append(bCard);
    }
}

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

function loadLocalStorage() {
    Object.keys(settings).forEach((key) => {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            settings[key] = JSON.parse(stored);
        } else {
            updateLocalStorage(key);
        }
    });

    if (!localStorage.getItem("times-visited")) {
        localStorage.setItem("times-visited", 0);
    }

    options.forEach(opt => {
        const key = opt.dataset.option;
        opt.checked = settings[key];
    });

    incrementVisitedCountAndText();
    applySettings();
}

function incrementVisitedCountAndText() {
    let welcome = document.getElementById("welcome");
    let count = parseInt(localStorage.getItem("times-visited")) + 1;
    localStorage.setItem("times-visited", count);

    if (count == 1) {
        welcome.textContent = `, THIS IS YOUR FIRST VISIT`;
    } else {
        welcome.textContent = `BACK,  BOOT #${count}`;
    }
}