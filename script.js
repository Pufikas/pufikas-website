let counter = 0;
const songs = [
    "0.mp3",
    "1.mp3",
    "2.mp3",
];
const audio = document.getElementById("audioplayer");
const audioDuration = document.getElementById("audio-duration");
const audioTotal = document.getElementById("audio-total");
const line = document.getElementById("audio-progress-line");

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

function playAudio() {
    const btn = document.getElementById("audio-pause-play");

    if (audio.paused) {
        audio.play();
        btn.innerText = "▶"
    } else {
        audio.pause();
        btn.innerText = "❚❚"
    }

}

function audioPlayNext() {
    counter = (counter + 1) % songs.length;
    audio.src = `./assets/music/${songs[counter]}`;
    audio.volume = 0.2;
    audio.play();

    console.log(counter)
}

function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${min}:${s.toString().padStart(2, '0')}`;
}

audio.addEventListener("loadedmetadata", () => {
    audioTotal.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    audioDuration.textContent = formatTime(audio.currentTime);
    const progress = (audio.currentTime / audio.duration) * 100;
    line.style.width = `${progress}%`;
});

setInterval(timer, 1000);
