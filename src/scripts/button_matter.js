let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

let Body = Matter.Body,
    Events = Matter.Events;

let dragging = null;
let lastMouse = { x: 0, y: 0 };
let lastTime = 0;

let prevMouse = { x: 0, y: 0 };
let prevTime = 0;

const matterBtns = [];

let engine = null;
let runner = null;

let showBtn = document.getElementById("buttonMatterShow");
let hideBtn = document.getElementById("buttonMatterReturn");

showBtn.addEventListener("click", (e) => {
    createMatter();
    startMerge();

    hideBtn.classList.remove("hidden");
    showBtn.classList.add("hidden");
});

hideBtn.addEventListener("click", (e) => {
    clearMatter();
    hideBtn.classList.add("hidden");
    showBtn.classList.remove("hidden");
});

function createMatter() {
    engine = Engine.create();
    runner = Runner.create();

    Matter.Events.on(engine, "afterUpdate", updateButtons);
    Runner.run(runner, engine);

    createBounds();
}

function clearMatter() {
    Runner.stop(runner);

    Composite.clear(engine.world, true);
    Engine.clear(engine);

    engine = null;
    runner = null;

    matterBtns.length = 0;

    document.getElementById("buttonMatterContainer").innerHTML = "";
    document.getElementById("buttonListWrapper").classList.remove("hidden");
}

function createBounds() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const t = 100; // thickness

    const walls = [
        Bodies.rectangle(w / 2, h + t / 2, w, t, { isStatic: true }), // ground
        Bodies.rectangle(w / 2, -t / 2, w, t, { isStatic: true }), // ceiling
        Bodies.rectangle(-t / 2, h / 2, t, h, { isStatic: true }), // left wall
        Bodies.rectangle(w + t / 2, h / 2, t, h, { isStatic: true }) // right wall
    ];

    Composite.add(engine.world, walls);
}

function createButtonBodies(x, y) {
    buttons.forEach((btn, i) => {
        const body = Bodies.rectangle(
            x + (Math.random() - 0.5),
            y + (Math.random() - 0.5), 
            88, 31,
            {
                restitution: 0.75,
                friction: 0.1,
                frictionStatic: 0.2,
                frictionAir: 0.015,
                density: 0.0008
            }
        );

        Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.39,
            y: (Math.random() - 0.5) * 0.39
        });

        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.4);
        Composite.add(engine.world, body);

        const img = document.createElement("img");

        img.src = `assets/buttons/${btn.img}`;
        img.className = "floatingButton";
        img.addEventListener("pointerdown", (e) => {
            e.preventDefault();

            // open the site with Ctrl + m1
            if (e.ctrlKey && e.button === 0) {
                window.open(`https://${btn.href}`, "_blank", "noopener,noreferrer,nofollow");
                return;
            }

            dragging = {
                body,
                element: img
            };

            lastMouse = {
                x: e.clientX,
                y: e.clientY
            };

            lastTime = performance.now();
            Body.setStatic(body, true);
        });

        document.getElementById("buttonMatterContainer").appendChild(img);

        matterBtns.push({
            body,
            element: img
        });
    });
}

function startMerge(e) {
    const container = document.getElementById("buttonList");
    const contWrapper = document.getElementById("buttonListWrapper");
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    container.classList.add("explode");

    container.addEventListener("animationend", () => {
        container.classList.remove("explode");
        contWrapper.classList.add("hidden");

        createButtonBodies(centerX, centerY);
    }, { once: true });
}

function updateButtons() {
    matterBtns.forEach(({ body, element }) => {
        element.style.transform =
            `translate(${body.position.x - 44}px, ${body.position.y - 15.5}px)
             rotate(${body.angle}rad)`;
    });
}

document.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const now = performance.now();

    Body.setPosition(dragging.body, {
        x: e.clientX,
        y: e.clientY
    });

    prevMouse = lastMouse;
    prevTime = lastTime;

    lastMouse = { x: e.clientX, y: e.clientY };
    lastTime = now;
});

document.addEventListener("pointerup", (e) => {
    if (!dragging) return;

    const dt = (lastTime - prevTime) / 1000;

    if (dt > 0) {
        Body.setVelocity(dragging.body, {
            x: (lastMouse.x - prevMouse.x) / dt * 0.009,
            y: (lastMouse.y - prevMouse.y) / dt * 0.009
        });
    }

    Body.setStatic(dragging.body, false);
    dragging = null;
});

Runner.run(runner, engine);