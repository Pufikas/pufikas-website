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
let favorites = [];
let settings = {};
let achievements = {};
let quotes = [];
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
let rebootText = [
    "[  II  ] Reboot requested by user",
    "[  II  ] Syncing disks...",
    "[  OK  ] Filesystems synced",
    "[  II  ] Stopping services...",
    "[  OK  ] Network service stopped",
    "[  OK  ] Display manager stopped",
    "[  II  ] Unmounting filesystems...",
    "[  OK  ] /home unmounted",
    "[  OK  ] /boot unmounted",
    "[  II  ] System halted",
    "",
    "       Rebooting...",
    "",
    "       GNU GRUB version 2.12",
    "",
    "       Loading boot menu...",
    "[  WW  ] Warning: default boot entry corrupted",
    "",
    "[  EE  ] Automatic recovery failed",
    "[  II  ] Attempting fallback boot entry...",
    "[  II  ] Loading backup kernel...",
    "",
    "       error: file '/boot/vmlinuz-linux' not found.",
    "       error: you need to load the kernel first.",
    "",
    "       grub rescue>",
    "       grub rescue> ls",
    "   (hd0) (hd0,msdos1) (hd0,msdos2)",
    "       grub rescue> ls (hd0,msdos1)/ ",
    "   lost+found/ boot/ etc/ home/",
    "       grub rescue> set root=(hd0,msdos1)",
    "       grub rescue> set prefix=(hd0,msdos1)/boot/grub",
    "       grub rescue> insmod normal",
    "       grub rescue> normal"
];

let currPage = 1;
let totalPages = 0;
let totalAch = 0;
let foundAch = 0;
const itemsPerPage = 8; // 2 cols
let dailyYesterday = {};
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
let nowNormalized = new Date().toISOString().split("T")[0]; // 2026-02-08 format

fetch("src/blogs/blogs.json")
    .then(res => res.json())
    .then(data => {
        loadBlogs(data);       
    }).catch(err => console.error("fetch failed for blogs ", err));

fetch("src/data/data.json")
    .then(res => res.json())
    .then(data => {
        buttons = data.buttons;
        contacts = data.contacts;
        songs = data.songs;
        settings = data.settings;
        achievements = data.achievements;
        favorites = data.favorites;
        quotes = data.quotes;
        loadStuff();
    }).catch(err => console.error("fetch failed for data ", err));

fetch("src/data/stats.json")
    .then(res => res.json())
    .then(data => {
        hourly = data.hourly;
        daily = data.daily;
        // dailyYesterday = data.daily[yesterday.toISOString().split("T")[0]];
        updateSiteStats();
    }).catch(err => console.error("fetch failed for website stats ", err));

async function fetchLastFM() {
    try {
        const res = await fetch("https://pufikasapistuff.vercel.app/api/lastfm");
        const track = await res.json();

        updateLastfmPanel(track);

        scheduleNextLastfmFetch(track.nowPlaying);
    } catch (err) {
        console.error("Error fetching Last.fm:", err);
        setTimeout(fetchLastFM, 60000);
    }
}

setInterval(async () => {
    const res = await fetch("https://pufikasapistuff.vercel.app/api/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: localStorage.clientId })
    });

    const data = await res.json();
    document.getElementById("onlineCount").textContent = data.online;
}, 30000);

function scheduleNextLastfmFetch(isPlaying) {
    const interval = isPlaying ? 20000 : 120000;
    setTimeout(fetchLastFM, interval);
}

function updateLastfmPanel(track) {
    const played = document.getElementById("lastfm-playingstatus");
    const lastfmtrack = document.getElementById("lastfm-track");
    const lastfmartist = document.getElementById("lastfm-artist")
    const coverArt = document.querySelector("#lastfm-listening-cover img");

    if (track.cover) {
        coverArt.src = track.cover;
    } else {
        coverArt.src = "./assets/misc/mikudance.gif";
    }

    if (!track.nowPlaying && track.playedAt) {
        played.textContent = formatTimeAgo(track.playedAt);
    } else {
        played.textContent = "Currently playing";
    }

    lastfmartist.textContent = track.artist;
    lastfmtrack.textContent = track.name;
}

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
    let localCached = JSON.parse(localStorage.getItem("web_stats")) || 0;

    setStat(vie, "booted ", localCached.views, " times", "ok");
    setStat(fol, "installed by ", localCached.followers, " users", "ok");
    setStat(upd, "deployed ", localCached.site_updates, " times", "ok");
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
    loadQuotes();
    loadSongEventListeners();
    loadPageFromUrl();
    loadLocalStorage();
    loadAchievements();

    Object.entries(contacts).forEach(([section, sectionContacts]) => {
        initContacts(section, sectionContacts);
    });

    Object.entries(favorites).forEach(([section, fav]) => {
        initFavorites(section, fav);
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
    audioPlay.addEventListener("click", () => {
        playAudio(); 
        getAchievement("dance-party");
    });
    audioProgress.addEventListener("click", seekIntoMusic.bind(this));
    document.getElementById("audio-play-next").addEventListener("click", () => audioPlayNext(1));
    document.getElementById("audio-play-previous").addEventListener("click", () => audioPlayNext(-1));
}

function createFavItem(item, sectionId) {
    const li = document.createElement("li");
        li.className = "fav";
        li.title = item.title || item.from;

    const a = document.createElement("a");
        a.className = "favLink";

    const img = document.createElement("img");
        img.className = "favImage";
        img.src = `/assets/favorites/${sectionId}/${item.image}`;

    // "title" is bottom left
    const title = document.createElement("span");
        title.className = "favTitle";
        title.textContent = item.title || item.name;
    
    // "release" is top right
    const release = document.createElement("span");
        release.className = "favRelease";
        release.textContent = item.release || "";

    a.append(img, title, release);
    li.appendChild(a);

    return li;
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

function initFavorites(sectionId, fav) {
    const fragment = document.createDocumentFragment(); // performance
    const container = document.getElementById(`${sectionId}Fav`);
        container.innerHTML = "";
    const ul = document.createElement("ul");
        ul.classList = "favList";
    const h5 = document.createElement("h5");
        h5.innerText = `${sectionId.toUpperCase()} (${fav.length})`;

    fav.forEach(f => {
        const li = createFavItem(f, sectionId);
        fragment.appendChild(li);
    });

    container.appendChild(h5);
    container.appendChild(ul);
    ul.appendChild(fragment);
}

function initLoadEffect() {
    const splash = document.querySelector(".splash-boot");
    splash.style.opacity = 1;
    splash.classList.remove("hidden");
    // splash.textContent = "";

    const markers = {
        "  OK  ": "ok",
        "  WW  ": "ww",
        "  EE  ": "fail",
        "  !!  ": "fail",
        "  II  ": "info"
    };

    bootText.forEach((line, i) => {
        setTimeout(() => {
            const p = document.createElement("p");

            let foundMarker = false;
            for (const marker in markers) {
                if (line.includes(marker)) {
                    p.innerHTML = line.replace(marker,`<span class="${markers[marker]}">${marker}</span>`);
                    foundMarker = true;
                    break;
                }
            }

            if (!foundMarker) p.textContent = line;

            splash.append(p);
        }, i * 100 + Math.random() * 100 + (line.includes("Incorrect") ? 300 : 0));
    });

    // hide splash after all lines
    setTimeout(() => {
        splash.style.opacity = 0;
        splash.classList.add("hidden");
    }, bootText.length * 190);

    if (!splash.dataset.listenerAdded) {
        splash.addEventListener("click", () => {
            splash.style.opacity = 0.2;
            splash.textContent = "User input detected Quitting";

            setTimeout(() => {
                splash.classList.add("hidden");
                splash.textContent = "";
            }, 620);
        });
        splash.dataset.listenerAdded = "true";
    }
}

function reboot() {
    const splash = document.querySelector(".splash-reboot");
    splash.style.opacity = 1;
    splash.classList.remove("hidden");
    splash.textContent = "";

    const markers = {
        "  OK  ": "ok",
        "  WW  ": "ww",
        "  EE  ": "fail",
        "  !!  ": "fail",
        "  II  ": "info"
    };

    let cumulativeDelay = 0;

    rebootText.forEach((line) => {
        let delay = 100 + Math.random() * 100;

        if (line.includes("Rebooting") || line.includes("Booting")) delay += 1000;
        if (line.toLowerCase().includes("error")) delay += 1400;
        if (line.includes("Attempting")) delay += 4000;
        if (line.includes("grub rescue>")) delay += 1600;

        cumulativeDelay += delay;

        setTimeout(() => {
            const p = document.createElement("p");

            let foundMarker = false;
            for (const marker in markers) {
                if (line.includes(marker)) {
                    p.innerHTML = line.replace(marker, `<span class="${markers[marker]}">${marker}</span>`);
                    foundMarker = true;
                    break;
                }
            }

            if (!foundMarker) p.textContent = line;

            splash.append(p);
            if (line.includes("grub rescue>")) getAchievement("reboot");
            
            if (line.endsWith("normal")) {

                setTimeout(() => {
                    splash.style.opacity = 0;
                    splash.classList.add("hidden");
                    splash.textContent = "";

                    initLoadEffect();
                }, 2400);
            }
        }, cumulativeDelay);
    });
}

function loadAchievements() {
    const stored = localStorage.getItem("achievements");
    const achContainer = document.getElementById("achievementCollectedContainer");
    
    foundAch = 0;
    totalAch = 0;

    if (stored) {
        const saved = JSON.parse(stored);

        Object.entries(achievements).forEach(([key, ach]) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("tooltip");
            wrapper.dataset.achievement = key;

            const img = document.createElement("img");
            img.classList.add("achImg");
            img.src = `/assets/achievements/${key}.png`;

            const tooltip = document.createElement("div");
            tooltip.classList.add("tooltiptext");

            const title = document.createElement("p");
            title.textContent = ach.title;

            tooltip.appendChild(title);
            wrapper.appendChild(img);
            wrapper.appendChild(tooltip);

            achContainer.appendChild(wrapper);

            if (saved[key]?.unlocked) {
                ach.unlocked = true;
                foundAch++;
            } else {
                ach.unlocked = false;
                wrapper.classList.add("locked");
            }
            
            totalAch++;
        });

    }

    document.getElementById("totalAchievements").innerText = totalAch;
    document.getElementById("achievementsFound").innerText = foundAch;
    
    localStorage.setItem("achievements", JSON.stringify(achievements));
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

    if (!localStorage.clientId) {
        localStorage.clientId = crypto.randomUUID();
    }

    const refreshed = localStorage.getItem("data_refreshed");
    if (refreshed !== nowNormalized) {
        updateWebStats();
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
    let todayCount = parseInt(localStorage.getItem("times-visited-today")) + 1 || 0;

    localStorage.setItem("times-visited", count);
    localStorage.setItem("times-visited-today", todayCount);
    
    if (!localStorage.getItem("last-date-visit") == nowNormalized || !localStorage.getItem("data_refreshed") == nowNormalized) {
        updateWebStats();
    }

    if (count == 1) {
        welcome.textContent = `, THIS IS YOUR FIRST VISIT`;
        getAchievement("welcome");
    } else {
        welcome.textContent = `BACK,  BOOT #${count}`;
    }
}

async function updateWebStats() {
    const nekoweb = await fetch("https://nekoweb.org/api/site/info/pufikas.nekoweb.org").then(r => r.json());

    const cachedWebStats = {
        data_refreshed: nowNormalized,
        site_updates: nekoweb.updates,
        followers: nekoweb.followers,
        views: nekoweb.views
    };


    localStorage.setItem("web_stats", JSON.stringify(cachedWebStats));
    websiteStats();
}

function loadQuotes() {
    getNewQuoteNum();
    document.getElementById("quoteNew").addEventListener("click", getNewQuoteNum);
}

fetchLastFM();