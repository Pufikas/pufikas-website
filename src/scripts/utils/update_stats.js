import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const statsPath = path.resolve(__dirname, "../../data/stats.json");

const nekoweb = await fetch("https://nekoweb.org/api/site/info/pufikas.nekoweb.org").then(r => r.json());
const commits = await fetch("https://api.github.com/repos/Pufikas/pufikas-website/commits?sha=main&author=Pufikas&per_page=1").then(r => r.json());
const details = await fetch(`https://api.github.com/repos/Pufikas/pufikas-website/commits/${commits[0].sha}`).then(r => r.json());

// need to fetch github api twice, one time for commit message and second time for line deletion and addition, because one endpoint doesnt include both

const now = new Date();
const dayNow = now.toISOString().split("T")[0]; // returns yy-mm-dd format

let stats = { hourly: {}, daily: {} };

if (fs.existsSync(statsPath)) {
    stats = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
}

const newHourlyCurrent = {
    generated_at: now.toISOString(),
    site_updates: nekoweb.updates,
    followers: nekoweb.followers,
    views: nekoweb.views,
    code_additions: details.additions,
    code_deletions: details.deletions,
    code_message: commits[0].commit.message,
    code_sha: details.sha,
    site_updated_at: Date.parse(details.commit.committer.date),
};

const newDailyCurrent = {
    site_updates: nekoweb.updates,
    followers: nekoweb.followers,
    views: nekoweb.views,
};

stats.hourly = newHourlyCurrent;

if (!stats.daily[dayNow]) {
    stats.daily[dayNow] = newDailyCurrent;
}

fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf-8");