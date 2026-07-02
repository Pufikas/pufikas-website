let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

var engine = Engine.create();

const render = Render.create({
    element: document.getElementById("buttonMatterContainer"),
    engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

document.getElementById("buttonMatterBtn").addEventListener("click", () => {
    createButtonBodies()
});

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

function createButtonBodies() {
    buttons.forEach((btn, i) => {
        Composite.add(engine.world,
            Bodies.rectangle(100 + i * 100, 50, 88, 31,
                {
                    restitution: 0.6,
                    friction: 0.05,
                    frictionAir: 0.01,
                    density: 0.001,
                    render: {
                        sprite: {
                            texture: `assets/buttons/${btn.img}`
                        }
                    }
                }
            )
        );
    });
}

// let mouse = Mouse.create(render.canvas),
//     mouseConstraint = MouseConstraint.create(engine, {
//         mouse: mouse,
//         constraint: {
//             stiffness: 0.2,
//             render: {
//                 visible: false
//             }
//         }
//     });

// Composite.add(engine.world, mouseConstraint);

// render.mouse = mouse;

Render.run(render);
var runner = Runner.create();
Runner.run(runner, engine);

createBounds();