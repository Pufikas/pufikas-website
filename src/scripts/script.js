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

// let cursorParticles = true;
// let scanlines = true;


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

function update() {
    const { h, m, s, ss, mm, hh } = timer();

    timeRes.innerHTML = ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
    timeBeen.innerHTML = "running for " + ("0" + mm).slice(-2) + ":" + ("0" + ss).slice(-2);
}

function updateLocalStorage(key) {
    localStorage.setItem(key, JSON.stringify(settings[key]));
}

function applySettings() {
    document.getElementById("html").classList.toggle("scanlines", settings["scanlines"]);
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

setInterval(update, 1000);
autoPageLoop();