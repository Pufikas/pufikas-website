const songs = [
    {
        "song": "Angel_boring.mp3",
        "title": "Angel boring",
        "cover": "internet_overdose.jpg", 
        "author": "Aiobahn",
    },
    {
        "song": "tenshi.mp3",
        "title": "天使だって緊張する",
        "cover": "internet_overdose.jpg", 
        "author": "Aiobahn",
    },
    {
        "song": "ummei.mp3",
        "title": "風～運命のダークサイド",
        "cover": "ummei.jpg", 
        "author": "ZUN",
    },
];

let counter = 0;
const musicPath = `./assets/music/`;
const audio = document.getElementById("audio-player");
const line = document.getElementById("audio-progress-line");
const volumeLine = document.getElementById("audio-volume-line")
const audioProgress = document.getElementById("audio-progress-container");
const audioPlay = document.getElementById("audio-pause-play");
const audioVolume = document.getElementById("audio-volume");
const audioMeta = document.getElementById("audio-meta");

function initLoad() {
    audio.volume = 0.2;
    volumeLine.style.width = "20%";
}

function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${min}:${s.toString().padStart(2, '0')}`;
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

function audioPlayNext(option) {
    counter = (counter + option + songs.length) % songs.length;
    audio.src = `${musicPath}${songs[counter].song}`;
    document.querySelector("#audio-cover img").src = `${musicPath}${songs[counter].cover}`;

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

audio.addEventListener("loadedmetadata", () => {
    document.getElementById("audio-total").textContent = formatTime(audio.duration);
    document.getElementById("audio-title").textContent = songs[counter].title;
    document.getElementById("audio-author").textContent = songs[counter].author;
});

audio.addEventListener("timeupdate", () => {
    document.getElementById("audio-duration").textContent = formatTime(audio.currentTime);
    const progress = (audio.currentTime / audio.duration) * 100;
    line.style.width = `${progress}%`;

    if (line.style.width == "100%") {
        audioPlay.innerText = "▶";
        audio.pause();
    }
});

audioVolume.addEventListener("click", changeVolume);
audioPlay.addEventListener("click", playAudio);
audioProgress.addEventListener("click", seekIntoMusic.bind(this));
document.getElementById("audio-play-next").addEventListener("click", () => audioPlayNext(1));
document.getElementById("audio-play-previous").addEventListener("click", () => audioPlayNext(-1));

initLoad();