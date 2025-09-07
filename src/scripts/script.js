const navLinks = document.querySelectorAll(".navlink");
const options = document.querySelectorAll(".option-check");

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

function update() {
    const { h, m, s, ss, mm, hh } = timer();

    timeRes.innerHTML = ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
    timeBeen.innerHTML = "running for " + ("0" + mm).slice(-2) + ":" + ("0" + ss).slice(-2);
}

function disableOption(option) {
    switch (option) {
        case "scanlines":
            document.getElementById("container").classList.toggle("scanlines");
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

navLinks.forEach((link) => {
    link.addEventListener("click", () => showPanel(link));
});

options.forEach((option) => {
    option.addEventListener("click", () => disableOption(option.dataset.option));
});

setInterval(update, 1000);
