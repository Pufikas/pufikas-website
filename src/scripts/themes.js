// let switches = document.querySelectorAll(".switch");
// let container = document.getElementById("theme-container");
// let themeInner = document.getElementById("theme-inner");


const themes = ["miku", "teto", "neru"];

// maybe parsing and stringify isnt needed here, but this works soo..
// syncs the rotation to next theme based on current theme, and also need to parse cuz I stringified it earlier...
let i = themes.indexOf(JSON.parse(localStorage.getItem("theme"))); 
if (i === -1) i = 0; // if something corrupts or smth

function updateThemeStuff(index) {
    const theme = themes[index];
    document.getElementById("current-theme").innerText = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", JSON.stringify(theme)); // need to stringify (even though it's already a string) so it becomes a valid json
    settings.theme = theme;
}

document.getElementById("theme-switch").addEventListener("click", () => {
    i = (i + 1) % themes.length;
    updateThemeStuff(i);
});

updateThemeStuff(i);