const navLinks = document.querySelectorAll(".navlink");
const options = document.querySelectorAll(".option-check");
const cursor = document.querySelector(".cursor");
const blogs = document.querySelectorAll(".blog-container")
let timeout;
let mouseOverBtns = false;

let particleChance = 0.2;
let particleSize = 16;
let timeRes = document.getElementById("time");
let timeBeen = document.getElementById("timeBeen");
let hh = mm = ss = 0;
let cursorParticles = true;

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

function disableOption(option) {
    switch (option) {
        case "scanlines":
            document.getElementById("html").classList.toggle("scanlines");
            break;
        case "cursor-particles":
            cursorParticles = !cursorParticles;
            break;
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

document.getElementById('cool-sites-panel').addEventListener("mouseenter", () => { mouseOverBtns = true; })
document.getElementById('cool-sites-panel').addEventListener("mouseleave", () => { mouseOverBtns = false; })

document.addEventListener("mousemove", (e) => {
    if (Math.random() < particleChance && cursorParticles) {
        spawnParticle(e.pageX, e.pageY);
    }
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => showPanel(link));
});

options.forEach((option) => {
    option.addEventListener("click", () => disableOption(option.dataset.option));
});

// to implement
// blogs.forEach((blog) => {
//     blog.addEventListener("click", () => expandBlog)
// })

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
