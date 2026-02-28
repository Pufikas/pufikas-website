const navLinks = document.querySelectorAll(".navlink");
const options = document.querySelectorAll(".option-check");
const cursor = document.querySelector(".cursor");
let blogCard = document.querySelectorAll("div.box.blogCard")
let timeout;
let mouseOverBtns = false;

let particleChance = 0.2;
let particleSize = 16;
let timeRes = document.getElementById("time");
let timeBeen = document.getElementById("timeBeen");
let hh = mm = ss = 0;

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
    })

    navLinks.forEach(link => {
        if (link === option) {
            link.classList.add("highlight");
        } else {
            link.classList.remove("highlight");
        }
    });
}

function copyMyButton() {
    const code = `<a target="_blank" rel="nofollow" href="https://pufikas.nekoweb.org/"><img src="https://pufikas.nekoweb.org/assets/buttons/pufikas88x31.png" alt="Pufikas Personal Site (REAL!!)/></a>`
    
    navigator.clipboard.writeText(code);

    alert("html copied!")
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
    })
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
        fetch("/src/blogs/" + card.dataset.blogFile)
        .then(res => res.text())
        .then(html => {
            article.innerHTML = html;
            article.dataset.loaded = "true";
            card.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }
    location.hash = `blogs?post=${card.dataset.blogId}`;
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

document.getElementById('cool-sites-panel').addEventListener("mouseenter", () => { mouseOverBtns = true; })
document.getElementById('cool-sites-panel').addEventListener("mouseleave", () => { mouseOverBtns = false; })

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
        updateLocalStorage(key);
        applySettings();
    });
});

window.addEventListener("hashchange", () => {
    if (location.hash.startsWith("#blogs")) return;
    loadPageFromUrl();
});

document.getElementById("copyButtonCode").addEventListener("click", () => copyMyButton());
document.getElementById("love").addEventListener("click", () => { particleChance += 0.1; particleSize += 2; });

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
dragElement(document.querySelector(".movable-window"));

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

const windowEl = document.querySelector(".movable-window");
const content = document.getElementById("lastfm");

document.querySelector(".minimize").onclick = () => {
    content.style.display = content.style.display === "none" ? "flex" : "none";
};

document.querySelector(".close").onclick = () => {
    windowEl.style.display = "none";
};

setInterval(update, 1000);
autoPageLoop();