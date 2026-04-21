const fs = require("fs");
const path = require("path");

const statsPath = path.resolve(__dirname, "../../data/stats.json");

async function run() {
    const nekoweb = await fetch("https://nekoweb.org/api/site/info/pufikas.nekoweb.org")
        .then(r => r.json());

    const commits = await fetch("https://api.github.com/repos/Pufikas/pufikas-website/commits?sha=main&author=Pufikas&per_page=1")
        .then(r => r.json());

    const details = await fetch(`https://api.github.com/repos/Pufikas/pufikas-website/commits/${commits[0].sha}`)
        .then(r => r.json());

    const now = new Date();
    const dayNow = now.toISOString().split("T")[0];

    let stats = { hourly: {}, daily: {} };

    if (fs.existsSync(statsPath)) {
        try {
            stats = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
        } catch (e) {
            console.warn("something wrong with stats.json");
        }
    }

    const newHourlyCurrent = {
        generated_at: now.toISOString(),
        site_updates: nekoweb.updates,
        followers: nekoweb.followers,
        views: nekoweb.views,
        code_additions: details?.stats?.additions ?? 0,
        code_deletions: details?.stats?.deletions ?? 0,
        code_message: commits?.[0]?.commit?.message ?? "",
        code_sha: details?.sha ?? null,
        site_updated_at: details?.commit?.committer?.date ? Date.parse(details.commit.committer.date) : null,
    };

    const newDailyCurrent = {
        site_updates: nekoweb.updates,
        followers: nekoweb.followers,
        views: nekoweb.views,
    };

    stats.hourly = newHourlyCurrent;

    stats.daily[dayNow] = {
        ...stats.daily[dayNow],
        ...newDailyCurrent
    };

    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf-8");
}

run().catch(err => {
    console.error("update failed:", err);
});