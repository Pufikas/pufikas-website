function timer() {
    let res = document.getElementById("time");
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    res.textContent = ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
}

function disableOption(option) {
    switch(option) {
        case "scanline":
            document.getElementById("page").classList.toggle("scanlines");
    } 
}

setInterval(timer, 1000);
