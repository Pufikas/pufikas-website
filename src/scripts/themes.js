let switches = document.querySelectorAll(".switch");
let container = document.getElementById("theme-container");
let button = document.getElementById("theme-switch");
let themeInner = document.getElementById("theme-inner");
let currThemeText = document.getElementById("current-theme");
const themes = ["miku", "teto", "neru"]
let currTheme = "";
let i = 0;

button.addEventListener("click", () => {
    currTheme = themes[i % themes.length];
    currThemeText.innerText = currTheme;

    document.documentElement.setAttribute(
        "data-theme",
        currTheme
    );

    i++;
})

