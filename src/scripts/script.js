const navLinks = document.querySelectorAll(".navlink");
const options = document.querySelectorAll(".option-check");
const cursor = document.querySelector(".cursor");
const content = document.getElementById("lastfm");

const movWin = document.querySelectorAll(".movable-window");
const movMin = document.querySelectorAll(".minimize");
const movClo = document.querySelectorAll(".close");

let blogCard = document.querySelectorAll("div.box.blogCard")
let timeout;
let mouseOverBtns = false;

let particleChance = 0.2;
let particleSize = 16;
let particleCount = 30; // particle count only for explosion
let maxParticleDistance = 100;
let timeRes = document.getElementById("time");
let timeBeen = document.getElementById("timeBeen");
let hh = mm = ss = 0;

let lPanel = document.querySelector(".menu-left");
let rPanel = document.querySelector(".menu-right");
const blogPanel = document.querySelector('[data-panel="blogs"]');

function timer() {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();

    ss += 1;

    if (ss >= 60) {
        mm += Math.floor(ss / 60);
        ss %= 60;
    }

    if (mm >= 60) {
        hh += Math.floor(mm / 60);
        mm %= 60;
    }

    return { h, m, s, ss, mm, hh };
}

function getMyTime() {
    return new Intl.DateTimeFormat("lt-LT", {
        timeZone: "Europe/Vilnius",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).format(new Date());
}

function update() {
    const { h, m, s, ss, mm, hh } = timer();

    // timeRes.textContent = ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
    timeRes.textContent = getMyTime();
    timeBeen.textContent = "running for " + ("0" + mm).slice(-2) + ":" + ("0" + ss).slice(-2);
    if (ss == 39) getAchievement("sankyuu");
}

function updateLocalStorage(key) {
    localStorage.setItem(key, JSON.stringify(settings[key]));
}

function applySettings() {
    document.getElementById("html").classList.toggle("scanlines", settings["scanlines"]);
    
    if (settings["simple-background"]) {
        document.body.style.backgroundImage = "none";
    } else {
        document.body.style.backgroundImage = "";
    }
}

const visitedPanels = new Set();

function showPanel(option) {
    const panels = document.querySelectorAll("[data-panel]");

    panels.forEach(panel => {
        if (panel.dataset.panel === option.dataset.id) {
            panel.classList.remove("hidden");
            panel.classList.add("active");
        } else {
            panel.classList.remove("active");
            panel.classList.add("hidden");
        }
        // temp?
        panel.classList.remove("mainBigger")
        lPanel.classList.remove("hidden");
    })

    navLinks.forEach(link => {
        if (link === option) {
            link.classList.add("highlight");
            visitedPanels.add(link.dataset.id);
        } else {
            link.classList.remove("highlight");
        }
    });

    if (visitedPanels.size === navLinks.length) {
        getAchievement("curious");
    }
}

function copyMyButton() {
    const code = `
        <a target="_blank" rel="nofollow" href="https://pufikas.nekoweb.org/">
            <img src="https://pufikas.nekoweb.org/assets/buttons/pufikas88x31.png" title="pufikas 39" alt="puf"/>
        </a>`;
    
    navigator.clipboard.writeText(code);

    alert("html copied!");
}

function spawnParticle(x, y) {
    let part = document.createElement("div"); 
    const drift = (Math.random() * 98 - 50) + "px";
    const size = Math.random() * 4 + particleSize;
    const dur = Math.random() * 1 + 3;
    
    part.style.setProperty("--drift", drift);
    part.style.width = size + "px";
    part.style.height = size + "px";
    part.style.animationDuration = dur + "s";
    
    part.style.left = x + "px";
    part.style.top = y + "px";
    
    part.classList.add("particle");
    document.body.appendChild(part);
    
    part.addEventListener("animationend", () => {
        part.remove();
    });
}

function autoPageLoop() {
    if (!mouseOverBtns) {
        currPage = currPage < totalPages ? currPage + 1 : 1;
        renderPageButtons();
    }

    setTimeout(autoPageLoop, 5000);
}

function parseHash() {
    // gets url params
    const [panel, query] = location.hash.slice(1).split("?");
    const params = new URLSearchParams(query || "");
    
    return { panel, params }; 
}

function loadPageFromUrl() {
    // loads the panel from url params
    const { panel, params } = parseHash();
    if (!panel) return;

    const nav = document.querySelector(`.navlink[data-id="${panel}"]`);
    if (!nav) return;

    showPanel(nav);

     if (panel === "blogs") {
        const postId = params.get("post");
        if (!postId) return;

        // small delay for blogs to be rendered
        setTimeout(() => {
            const card = document.getElementById(postId);
            if (card) {
                card.querySelector(".blogToggle")?.click();
            }
        }, 100);
    }
}

function closeAllBlogs() {
    document.querySelectorAll(".blogCard")
        .forEach(c => {
            c.classList.remove("expanded");
            c.querySelector(".blogToggle").textContent = "▶ ▶ ▶"; 
        });
}

function expandBlog(e) {
    e.stopPropagation();

    const card = e.currentTarget.closest(".blogCard");
    const article = card.querySelector(".blogArticle");
    const arrow = e.currentTarget;
    const expanded = card.classList.toggle("expanded");
    
    // this keeps only single blog loaded
    document.querySelectorAll(".blogCard.expanded")
        .forEach(c => {
            if (c !== card) {
                c.classList.remove("expanded");
                c.querySelector(".blogToggle").textContent = "▶ ▶ ▶";
            }
        });
    
    arrow.textContent = expanded ? "▼ ▼ ▼" : "▶ ▶ ▶";
    
    if (expanded && !article.dataset.loaded) {
        fetch("_site/blogs/" + card.dataset.blogFile)
        .then(res => res.text())
        .then(html => {
            article.innerHTML = html;
            article.dataset.loaded = "true";
            card.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }
    pop(e);
    location.hash = `blogs?post=${card.dataset.blogId}`;
    getAchievement("reading");
}

function formatTimeAgo(unixSeconds) {
    const now = Date.now();
    const past = unixSeconds * 1000;
    const diff = Math.floor((past - now) / 1000); // difference in seconds (negative)

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const divisions = [
        { amount: 60, name: "seconds" },
        { amount: 60, name: "minutes" },
        { amount: 24, name: "hours" },
        { amount: 7, name: "days" },
        { amount: 4.34524, name: "weeks" },
        { amount: 12, name: "months" },
        { amount: Number.POSITIVE_INFINITY, name: "years" }
    ];

    let duration = diff;

    for (const division of divisions) {
        if (Math.abs(duration) < division.amount) {
            return rtf.format(Math.round(duration), division.name);
        }
        duration /= division.amount;
    }
}

function showAchievement(name) {
    const toast = document.getElementById("achievement-toast");
    const imgPath = `/assets/achievements/${name}.png`;
    const ach = achievements[name];

    document.getElementById("achievement-title").innerText = ach.title;
    document.getElementById("achievement-description").innerText = ach.desc;
    document.getElementById("achievement-toast-icon").src = imgPath; 
    
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function getAchievement(name) {
    if (!achievements[name].unlocked) {
        achievements[name].unlocked = true;
        foundAch++;

        const el = document.querySelector(`[data-achievement="${name}"]`);
        if (el) el.classList.remove("locked");
        
        document.getElementById("achievementsFound").innerText = foundAch;

        localStorage.setItem("achievements", JSON.stringify(achievements));
        showAchievement(name);
    }
}

document.getElementById("cool-sites-panel").addEventListener("mouseenter", () => { mouseOverBtns = true; })
document.getElementById("cool-sites-panel").addEventListener("mouseleave", () => { mouseOverBtns = false; })

document.addEventListener("mousemove", (e) => {
    if (Math.random() < particleChance && settings["cursor-particles"]) {
        spawnParticle(e.pageX, e.pageY);
    }
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        location.hash = link.dataset.id;
        // temp fix for closing all blogs when navigating out of blogs
        if (!location.hash.startsWith("#blogs")) closeAllBlogs();
        showPanel(link);
    });
});

options.forEach((opt) => {
    opt.addEventListener("change", () => {
        const key = opt.dataset.option;
        settings[key] = opt.checked;
        getAchievement("customizing");
        updateLocalStorage(key);
        applySettings();
    });
});

window.addEventListener("hashchange", () => {
    if (location.hash.startsWith("#blogs")) return;
    loadPageFromUrl();
});

document.getElementById("copyButtonCode").addEventListener("click", (e) => { copyMyButton(); pop(e); getAchievement("share"); });

document.getElementById('prevBtn').onclick = () => {
    if (currPage > 1) {
        currPage--;
    } else {
        currPage = totalPages;
    }
    renderPageButtons();
};

document.getElementById('nextBtn').onclick = () => {
    if (currPage < totalPages) {
        currPage++;
    } else {
        currPage = 1;
    }
    renderPageButtons();
};

// code "inspired" by w3schools https://www.w3schools.com/howto/howto_js_draggable.asp

movWin.forEach(e => {
    dragElement(e);
});

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".minimize");

    if (e.target.classList.contains("close")) {
        const win = e.target.closest(".movable-window");
        win.style.display = "none";
        getAchievement("popup");
    }

    if (btn) {
        const content = btn.closest(".movable-window").querySelector(".window-content");

        content.classList.toggle("hidden");
    }
});

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV: 
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// stars not used for now
// const header = document.getElementById("star-container");
// const rect = header.getBoundingClientRect();

// const MAX_STAR_SIZE = 50;
// const MAX_STAR_SPEED = 20;

// const createStars = () => ({
//     x: Math.random() * rect.width,
//     y: Math.random() * rect.height,
//     radius: Math.floor(Math.random() * MAX_STAR_SIZE),
//     speed: Math.random() * MAX_STAR_SPEED +1
// });

// function spawnStar() {
//     let { x, y, radius, speed } = createStars();
//     let star = document.createElement("div"); 
//     const drift = speed + "px";
//     const dur = Math.random() * 1 + 3;

//     star.style.setProperty("--drift", drift);
//     star.style.width = radius + "px";
//     star.style.height = radius + "px";
//     star.style.animationDuration = dur + "s";
    
//     star.style.left = x + "px";
//     star.style.top = y + "px";
//     console.log(x, y)
    
//     star.classList.add("star");
//     header.appendChild(star);
    
//     star.addEventListener("animationend", () => {
//         star.remove();
//     })

//     console.log(star)
// }

// setInterval(spawnStar, 100);


function pop(e) {
    for (let i = 0; i < particleCount; i++) {
        createExplosionParticle(e.clientX, e.clientY);
    }
}

function createExplosionParticle(x, y) {
  const particle = document.createElement("div");

  const size = particleSize;
  particle.style.width = size + "px";
  particle.style.height = size + "px";
  particle.classList.add("popParticle");
  particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;

  document.body.appendChild(particle);

  // radial explosion
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * maxParticleDistance;
  const destinationX = x + Math.cos(angle) * distance;
  const destinationY = y + Math.sin(angle) * distance;

  const animation = particle.animate([
    {
      transform: `translate(${x}px, ${y}px)`,
      opacity: 1
    },
    {
      transform: `translate(${destinationX}px, ${destinationY}px)`,
      opacity: 0
    }
  ], {
    duration: Math.random() * 1000 + 500,
    easing: 'cubic-bezier(0, .9, .57, 1)',
    delay: Math.random() * 200
  });

  animation.finished.then(() => particle.remove());
}

function getRandomQuoteAudioPath(quote) {
    // this gives random audio path and makes sure it's always unique
    let lastAudioNum = null;
    let num;

    do {
        num = Math.floor(Math.random() * quote.audioFiles);
    } while (num === lastAudioNum && quote.audioFiles > 1);

    lastAudioNum = num;

    return `./assets/quoteaudio/${quote.audio}${num}.mp3`;
}

function playQuoteAudio(path) {
    const player = document.getElementById("quotePlayer");

    player.src = path;
    player.currentTime = 0;
    player.play();
}

function getNewQuoteNum() {
    let qNum = Math.floor(Math.random() * quotes.length);
    displayQuote(qNum);
}

function displayQuote(qNum) {
    const audioBtn = document.getElementById("quoteAudio");
    const quote = quotes[qNum];

    document.getElementById("quoteText").innerText = quote.text;
    document.getElementById("quoteBy").innerText = `― ${quote.by}`;

    const hasAudio = quote.audio && quote.audioFiles > 0;

    if (hasAudio) {
        audioBtn.classList.remove("hidden");
        audioBtn.disabled = false;

        audioBtn.onclick = () => {
            const path = getRandomQuoteAudioPath(quote);
            playQuoteAudio(path);
        };
    } else {
        audioBtn.classList.add("hidden");
        audioBtn.disabled = true;
        audioBtn.onclick = null;
    }
}

document.getElementById("love").addEventListener("click", (e) => {
    particleChance += 0.1; particleSize += 2; maxParticleDistance += 10; particleCount += 1;
    pop(e);
    getAchievement("miku-love");
    if (particleSize >= 39) getAchievement("miku-huge-love");
});

document.getElementById("clearAllCache").addEventListener("click", (e) => {
    localStorage.clear();
    location.reload();
});

const drawer = document.getElementById("drawer-panel");
const toggle = document.getElementById("drawerToggle");

document.getElementById("reboot-button").addEventListener("click", () => {
    let text = "Are you sure you want to reboot?";

    if (confirm(text) == true) reboot();
});

const favBtn = document.getElementById("favToggle");
const favPanel = document.getElementById("favoritesPanel");
let expandedFav = false;

favBtn.addEventListener("click", () => {
    expandedFav = !expandedFav;
    favPanel.classList.toggle("collapsed", !expandedFav);
    favBtn.classList.toggle("open", !expandedFav);
    favBtn.textContent = expandedFav ? "▼ ▼ ▼" : "▶ ▶ ▶";
});

// remove?
// document.getElementById("achievementCollectedContainerButton").addEventListener("click", () => {
//     document.getElementById("achievementCollectedContainer").classList.toggle("open");
// });

function updateBlogMainPanel() {
    if (!blogPanel) return;

    let size = 35;

    if (lPanel.classList.contains("hidden")) size += 12;
    if (rPanel.classList.contains("hidden")) size += 12;

    blogPanel.style.flex = `0 0 ${size}%`;
}

document.getElementById("hideLeftPanel").addEventListener("click", () => {
    lPanel.classList.toggle("hidden");
    updateBlogMainPanel();
});

document.getElementById("hideRightPanel").addEventListener("click", () => {
    rPanel.classList.toggle("hidden");
    updateBlogMainPanel();
});

setInterval(update, 1000);
autoPageLoop();