let bootText = [
    `[  !!  ] == CLICK ANYWHERE TO SKIP THIS ==
[  II  ] Current Operating System: Linux void 6.12.41_1`,
    `         Markers: (!!) notice, (II) informational,
         (WW) warning, (EE) error, (??) unknown.`,
    "[  II  ] Mounting pseudo-filesystems...",
    "         Loading kernel modules...",
    `[  !!  ] Before reporting problems, check https://github.com/Pufikas/pufikas-website       
         to make sure that you have the latest version`,
    "[  II  ] Checking filesystems...",
    "[  OK  ] Finished Load Kernel Modules",
    `         Initializing swap...
         Initializing random seed...`,
    `[  II  ] Starting udev daemon...
[  OK  ] Udev daemon running`,
    "[  II  ] Bringing up loopback interface...",
    `[  OK  ] lo interface up
[  II  ] Bringing up network interface eth0...`,
    "[  OK  ] eth0 connected at 195.142.1.45",
    "[  II  ] LoadModule: 'nv'",
    "[  WW  ] Warning, couldn't open module nv",
    "[  EE  ] Failed to load module 'nv' (module does not exist, 0)",
    "         Starting Apply Kernel Variables...",
    "[  OK  ] Finished Load Kernel Variables",
    "[  II  ] Starting Display Manager...",
    "         pufikas login",
    "         Password: *******",
    "[  EE  ] Incorrect password, booting as guest",
];
let rebootText = [
    "[  II  ] Reboot requested by user",
    "[  II  ] Syncing disks...",
    "[  OK  ] Filesystems synced",
    "[  II  ] Stopping services...",
    "[  OK  ] Network service stopped",
    "[  OK  ] Display manager stopped",
    "[  II  ] Unmounting filesystems...",
    "[  OK  ] /home unmounted",
    "[  OK  ] /boot unmounted",
    "[  II  ] System halted",
    "",
    "       Rebooting...",
    "",
    "       GNU GRUB version 2.12",
    "",
    "       Loading boot menu...",
    "[  WW  ] Warning: default boot entry corrupted",
    "",
    "[  EE  ] Automatic recovery failed",
    "[  II  ] Attempting fallback boot entry...",
    "[  II  ] Loading backup kernel...",
    "",
    "       error: file '/boot/vmlinuz-linux' not found.",
    "       error: you need to load the kernel first.",
    "",
    "       grub rescue>",
    "       grub rescue> ls",
    "   (hd0) (hd0,msdos1) (hd0,msdos2)",
    "       grub rescue> ls (hd0,msdos1)/ ",
    "   lost+found/ boot/ etc/ home/",
    "       grub rescue> set root=(hd0,msdos1)",
    "       grub rescue> set prefix=(hd0,msdos1)/boot/grub",
    "       grub rescue> insmod normal",
    "       grub rescue> normal"
];

function reboot() {
    const splash = document.querySelector(".splash-reboot");
    splash.style.opacity = 1;
    splash.classList.remove("hidden");
    splash.textContent = "";

    const markers = {
        "  OK  ": "ok",
        "  WW  ": "ww",
        "  EE  ": "fail",
        "  !!  ": "fail",
        "  II  ": "info"
    };

    let cumulativeDelay = 0;

    rebootText.forEach((line) => {
        let delay = 100 + Math.random() * 100;

        if (line.includes("Rebooting") || line.includes("Booting")) delay += 1000;
        if (line.toLowerCase().includes("error")) delay += 1400;
        if (line.includes("Attempting")) delay += 4000;
        if (line.includes("grub rescue>")) delay += 1600;

        cumulativeDelay += delay;

        setTimeout(() => {
            const p = document.createElement("p");

            let foundMarker = false;
            for (const marker in markers) {
                if (line.includes(marker)) {
                    p.innerHTML = line.replace(marker, `<span class="${markers[marker]}">${marker}</span>`);
                    foundMarker = true;
                    break;
                }
            }

            if (!foundMarker) p.textContent = line;

            splash.append(p);
            if (line.includes("grub rescue>")) getAchievement("reboot");
            
            if (line.endsWith("normal")) {

                setTimeout(() => {
                    splash.style.opacity = 0;
                    splash.classList.add("hidden");
                    splash.textContent = "";

                    initLoadEffect();
                }, 2400);
            }
        }, cumulativeDelay);
    });
}

function initLoadEffect() {
    const splash = document.querySelector(".splash-boot");
    splash.style.opacity = 1;
    splash.classList.remove("hidden");
    // splash.textContent = "";

    const markers = {
        "  OK  ": "ok",
        "  WW  ": "ww",
        "  EE  ": "fail",
        "  !!  ": "fail",
        "  II  ": "info"
    };

    bootText.forEach((line, i) => {
        setTimeout(() => {
            const p = document.createElement("p");

            let foundMarker = false;
            for (const marker in markers) {
                if (line.includes(marker)) {
                    p.innerHTML = line.replace(marker,`<span class="${markers[marker]}">${marker}</span>`);
                    foundMarker = true;
                    break;
                }
            }

            if (!foundMarker) p.textContent = line;

            splash.append(p);
        }, i * 100 + Math.random() * 100 + (line.includes("Incorrect") ? 300 : 0));
    });

    // hide splash after all lines
    setTimeout(() => {
        splash.style.opacity = 0;
        splash.classList.add("hidden");
    }, bootText.length * 190);

    if (!splash.dataset.listenerAdded) {
        splash.addEventListener("click", () => {
            splash.style.opacity = 0.2;
            splash.textContent = "User input detected Quitting";

            setTimeout(() => {
                splash.classList.add("hidden");
                splash.textContent = "";
            }, 620);
        });
        splash.dataset.listenerAdded = "true";
    }
}