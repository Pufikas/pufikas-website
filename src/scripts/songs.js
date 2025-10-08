let counter = 0;
const musicPath = `./assets/music/`;
const audio = document.getElementById("audio-player");
const line = document.getElementById("audio-progress-line");
const volumeLine = document.getElementById("audio-volume-line");
const audioProgress = document.getElementById("audio-progress-container");
const audioPlay = document.getElementById("audio-pause-play");
const audioVolume = document.getElementById("audio-volume");
const audioMeta = document.getElementById("audio-meta");
const audioCover = document.querySelector("#audio-cover img");
const audioTitle = document.getElementById("audio-title");
const audioAuthor = document.getElementById("audio-author");

function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${min}:${s.toString().padStart(2, '0')}`;
}

function playAudio() {
    if (audio.paused) {
        audio.play();
        audioPlay.innerText = "❚❚";
    } else {
        audio.pause();
        audioPlay.innerText = "▶";
    }
}

function audioPlayNext(option) {
    counter = (counter + option + songs.length) % songs.length;
    audio.src = `${musicPath}${songs[counter].song}`;
    audioCover.src = `${musicPath}${songs[counter].cover}`;

    playAudio();
}

function seekIntoMusic(e) {
    let percent = e.offsetX / audioProgress.offsetWidth;
    audio.currentTime = percent * audio.duration;
    line.style.width = percent * 100 + "%";
}

function changeVolume(e) {
    let percent = e.offsetX / audioVolume.offsetWidth;
    audio.volume = percent;
    volumeLine.style.width = `${percent * 100}%`;
}


