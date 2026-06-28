const fs = require("node:fs/promises");
const path = require("path");

const sitesPath = path.resolve(__dirname, "../../neighborhood/data/sites.json");
const writePath = path.resolve(__dirname, "../../data/neighborhood_sites.json");
const tagsPath = path.resolve(__dirname, "../../neighborhood/data/tag_list.json");

// script used to generate the parent of the source site
// uses website's tags to get the best matching parent and pushes to built_sites.json

async function main() {
    const data = JSON.parse(
        await fs.readFile(sitesPath, "utf8")
    );
    
    const tagsData = JSON.parse(
        await fs.readFile(tagsPath, "utf8")
    );
    
    const sites = data.sites;
    const validTags = new Set(tagsData.tags);

    await validateSites(sites, validTags);

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

async function validateSites(sites, validTags) {
    const ids = new Set();
    const urls = new Set();
    const errors = [];

    for (const site of sites) {
        if (!site.id)
            errors.push("site is missing its 'id'.");

        if (!site.name)
            errors.push(`${site.id ?? "<unknown>"}: missing 'name'.`);

        if (!site.url)
            errors.push(`${site.id ?? "<unknown>"}: missing 'url'.`);

        if (!site.img)
            errors.push(`${site.id ?? "<unknown>"}: missing 'img'.`);

        if (!Array.isArray(site.tags))
            errors.push(`${site.id ?? "<unknown>"}: 'tags' must be an array.`);

        // skip further checks if tags aren't an array
        if (!Array.isArray(site.tags))
            continue;

        // duplicate ids
        if (ids.has(site.id))
            errors.push(`Duplicate id: "${site.id}"`);
        else
            ids.add(site.id);

        // duplicate url
        if (urls.has(site.url))
            errors.push(`Duplicate url: "${site.url}"`);
        else
            urls.add(site.url);

        if (site.tags.length > 5)
            errors.push(`${site.id}: has more than 5 tags.`);

        // duplicate tags
        const uniqueTags = new Set(site.tags);
        if (uniqueTags.size !== site.tags.length)
            errors.push(`${site.id}: contains duplicate tags.`);

        // unknown tags
        for (const tag of site.tags) {
            if (!validTags.has(tag))
                errors.push(`${site.id}: unknown tag "${tag}"`);
        }
    }

    if (errors.length) {
        throw new Error(
            "validation failed:\n\n" +
            errors.join("\n")
        );
    }
}


main().catch(err => {
    console.error("failed in similiary.js", err);
});

// main().catch(console.error);