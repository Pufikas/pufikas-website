let counter = 0;



function timer() {
    let res = document.getElementById("time");
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    res.textContent = ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
}

function disableOption(option) {
    switch (option) {
        case "scanline":
            document.getElementById("page").classList.toggle("scanlines");
    } 
}

function showPanel(option) {
    const panels = document.querySelectorAll("[data-panel]");

    panels.forEach(panel => {
        if (panel.dataset.panel === option) {
            panel.classList.remove("hidden");
            panel.classList.add("active");
        } else {
            panel.classList.remove("active");
            panel.classList.add("hidden");
        }
    })
}

function loadStuff() {
    const audioPlayer = document.getElementById
}

let music = [
    ""
]

function audioPlayNext() {
    const audio = document.getElementById("audioplayer");
    const songs = [
        "0.mp3",
        "1.mp3",
        "2.mp3",
    ];

    counter = (counter + 1) % songs.length;
    audio.src = `./assets/music/${songs[counter]}`;
    audio.volume = 0.2;
    audio.play();

    console.log(counter)
}

setInterval(timer, 1000);
