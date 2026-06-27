const fs = require("node:fs/promises");
const path = require("path");

const sitesPath = path.resolve(__dirname, "../../neighborhood/data/sites.json");
const writePath = path.resolve(__dirname, "../../data/neighborhood_sites.json");

// script used to generate the parent of the source site
// uses website's tags to get the best matching parent and pushes to built_sites.json

async function main() {
    const data = JSON.parse(
        await fs.readFile(sitesPath, "utf8")
    );
    
    const sites = data.sites;
    
    sites.forEach((site, i) => {
        if (i === 0) {
            site.parent = null;
            return;
        }
    
        site.parent = findParent(site, sites.slice(0, i));
    });
    
    await fs.writeFile(
        writePath, 
        JSON.stringify({ sites }, null, 2)
    )
}

function findParent(newSite, existingSites) {
    let bestMatch = 0;
    let bestScore = -1;

    for (const site of existingSites) {
        const score = jaccard(newSite.tags, site.tags);

        if (site.id === newSite.id)
            continue;
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = site.id;
        }
    }

    return bestMatch;
}

function jaccard(a, b) {
    const setA = new Set(a);
    const setB = new Set(b);

    const intersection = [...setA].filter(tag => setB.has(tag)).length;

    const union = new Set([...setA, ...setB]).size;

    return union === 0 ? 0 : intersection / union;
}

main().catch(err => {
    console.error("failed in similiary.js", err);
});

// main().catch(console.error);