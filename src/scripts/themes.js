// let switches = document.querySelectorAll(".switch");
// let container = document.getElementById("theme-container");
// let themeInner = document.getElementById("theme-inner");
const secretBox = document.getElementById("secret-box");
const currSecretName = document.getElementById("current-secret");
const currThemeName = document.getElementById("current-theme");

const themes = ["miku", "teto", "neru", "triplebaka"];
const secret_themes = ["none", "halloween"];

// maybe parsing and stringify isnt needed here, but this works soo..
// syncs the rotation to next theme based on current theme, and also need to parse cuz I stringified it earlier...
let i = themes.indexOf(JSON.parse(localStorage.getItem("theme"))); 
if (i === -1) i = 0; // if something corrupts or smth

function updateThemeStuff(index) {
    const theme = themes[index];
    currThemeName.innerText = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", JSON.stringify(theme)); // need to stringify (even though it's already a string) so it becomes a valid json
    settings.theme = theme;
}

let secI = secret_themes.indexOf(JSON.parse(localStorage.getItem("secretTheme"))); 
if (secI === -1) secI = 0; // if something corrupts or smth

function updateSecretStuff(index) {
    const secret = secret_themes[index];
    currSecretName.innerText = secret;
    if (secret === "none") 
        delete document.documentElement.dataset.secret;
    else 
        document.documentElement.dataset.secret = secret;

    localStorage.setItem("secretTheme", JSON.stringify(secret));
}

function unlockSecrets(unlock = false) {
    const unlocked_secrets = JSON.parse(localStorage.getItem("achievements"))?.secret?.unlocked;

    if (!unlocked_secrets && !unlock)
        return;

    secretBox.classList.remove("hidden");

    getAchievement("secret");
}

// auto enable halloween on october (not 10 because month index starts from 0 (december is 11th))
const now = new Date();
if (now.getMonth() === 9 && localStorage.getItem("secretTheme") === null) {
    secI = secret_themes.indexOf("halloween");
}

document.getElementById("theme-switch").addEventListener("click", (e) => {
    i = (i + 1) % themes.length;
    updateThemeStuff(i);
    if (currThemeName.innerText == "triplebaka") 
        getAchievement("baka-squad");
});

document.getElementById("secret-switch").addEventListener("click", () => {
    secI = (secI + 1) % secret_themes.length;
    updateSecretStuff(secI);
});

const secretText = document.querySelector(".secretText");

secretText.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform" && secretText.matches(":hover")) {
        unlockSecrets(true);
        const rect = secretText.getBoundingClientRect();
        pop_custom_coords(rect.left + rect.width / 2, rect.top + rect.height / 2);
        let t = document.getElementById("current-secret")
        pop_custom_coords(t.getBoundingClientRect().left, t.getBoundingClientRect().top)
    }
});

updateThemeStuff(i);
updateSecretStuff(secI);
unlockSecrets();
