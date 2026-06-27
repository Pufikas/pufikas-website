cytoscape.use(cytoscapeDagre);

fetch("/src/data/neighborhood_sites.json")
    .then(res => res.json())
    .then(data => {
        const sites = createWebsites(data.sites);
        createCytoscape(sites);
    }).catch(err => console.error("couldnt fetch the sites.json", err));

function createWebsites(sites) {
    const websites = [];
    for (const site of sites) {
        websites.push({
            data: {
                id: String(site.id),
                name: site.name,
                img: site.img,
                url: site.url
            }
        });

        if (site.parent !== null) {
            websites.push({
                data: {
                    source: String(site.parent),
                    target: String(site.id)
                }
            });
        }
    }
    console.log(`Website data: ${websites}`);
    return websites;
}

function createCytoscape(elements) {
    
    function highlightPath(node) {
        cy.elements().addClass("dim");
        let current = node;

        while (true) {
            current.removeClass("dim");
            current.addClass("highlight");

            const edge = current.incomers("edge");

            if (edge.length === 0)
                break;

            edge.removeClass("dim");
            edge.addClass("highlight");
            current = edge.source();
        }
    }

    function clearHighlight() {
        cy.elements()
        .removeClass("highlight dim");
    }
    
    const cy = cytoscape({
        container: document.getElementById("graph"),
        elements,
        style: [
            {
                selector: "node",
                style: {
                    width: 88,
                    height: 31,
                    shape: "rectangle",
                    "background-fit": "cover",
                    "background-image": "data(img)",
                    label: ""
                }
            },
            {
                selector: "edge",
                style: {
                    width: 2,
                    "curve-style": "taxi"
                }
            },
            {
                selector: ".hovered",
                style: {
                    label: "data(name)",
                    "text-valign": "top",
                    "text-margin-y": -8,
                    "font-size": 12,
                    "text-background-color": "#000",
                    "text-background-opacity": 0.7,
                    "text-background-padding": 3,
                    "text-background-shape": "roundrectangle",
                    color: "#fff",
                }
            },
            {
                selector: ".highlight",
                style: {
                    // "border-width": 2,
                    // "border-color": "#ffd700",
                    "line-color": "#ffd700",
                    "target-arrow-color": "#ffd700",
                    opacity: 1
                }
            },
            {
                selector: ".dim",
                style: {
                    opacity: 0.6
                }
            }
        ],
        layout: {
            name: "dagre",
            rankDir: "TB",
            nodeSep: 50,
            rankSep: 100
        }
    });

    cy.on("tap", "node", e => {
        window.open(e.target.data("url"), "_blank");
    });

    cy.on("mouseover", "node", e => {
        e.target.addClass("hovered");
        highlightPath(e.target);
    });

    cy.on("mouseout", "node", e => {
        e.target.removeClass("hovered");
        clearHighlight();
    });
}
