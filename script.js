// audio player stuff
let counter = 0;
const songs = [
    {
        "song": "0.mp3",
        "title": "1",
        "cover": "internet_overdose.jpg" 
    },
    {
        "song": "1.mp3",
        "title": "2",
        "cover": "internet_overdose.jpg" 
    },
]
const musicPath = `./assets/music/`;
const audio = document.getElementById("audio-player");
const audioDuration = document.getElementById("audio-duration");
const audioTotal = document.getElementById("audio-total");
const line = document.getElementById("audio-progress-line");
const audioProgress = document.getElementById("audio-progress-container");
const audioPlay = document.getElementById("audio-pause-play");
const audioNext = document.getElementById("audio-play-next");
const audioCover = document.getElementById("audio-cover");
const audioVolumeLine = document.getElementById("audio-volume-line");
const audioVolume = document.getElementById("audio-volume");
// end of audio player stuff

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


function playAudio() {
    if (audio.paused) {
        audio.play();
        audioPlay.innerText = "❚❚"
    } else {
        audio.pause();
        audioPlay.innerText = "▶"
    }

}

function audioPlayNext() {
    counter = (counter + 1) % songs.length;
    audio.src = `${musicPath}${songs[counter].song}`;
    
    console.log(songs)
    console.log(musicPath, songs[counter].song)
    playAudio();

    console.log(counter)
}

function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${min}:${s.toString().padStart(2, '0')}`;
}

function seekIntoMusic(e) {
    let percent = e.offsetX / audioProgress.offsetWidth;
    audio.currentTime = percent * audio.duration;
    line.style.width = percent * 100 + "%";
}

function changeVolume(e) {
    const percent = e.offsetX / audioVolume.offsetWidth;
    audio.volume = percent;
    audioVolumeLine.style.width = `${percent * 100}%`;
    console.log(percent)
}

audioVolume.addEventListener("click", changeVolume);

audio.addEventListener("loadedmetadata", () => {
    audioTotal.textContent = formatTime(audio.duration);
    audioCover.innerHTML = `<img src=${musicPath}${songs[counter].cover} style="width: 128px;" class="center">`;
});

audio.addEventListener("timeupdate", () => {
    audioDuration.textContent = formatTime(audio.currentTime);
    const progress = (audio.currentTime / audio.duration) * 100;
    line.style.width = `${progress}%`;

    if (line.style.width == "100%") {
        audio.pause();
    }
});

audioPlay.addEventListener("click", playAudio);
audioNext.addEventListener("click", audioPlayNext);
audioProgress.addEventListener("click", seekIntoMusic.bind(this));


setInterval(timer, 1000);
