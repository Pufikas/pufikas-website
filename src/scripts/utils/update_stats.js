import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const statsPath = path.resolve(__dirname, "../../data/stats.json");

const github = await fetch("https://api.github.com/repos/Pufikas/pufikas-website/commits/dev");
const nekoweb = await fetch("https://nekoweb.org/api/site/info/pufikas.nekoweb.org");

const ghData = await github.json();
const nwData = await nekoweb.json();

const now = new Date();
const dayNow = now.toISOString().split("T")[0]; // returns yy-mm-dd format

let stats = { hourly: {}, daily: {} };

if (fs.existsSync(statsPath)) {
    stats = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
}

const newHourlyCurrent = {
    generated_at: now.toISOString(),
    site_updates: nwData.updates,
    followers: nwData.followers,
    views: nwData.views,
    code_additions: ghData.stats.additions,
    code_deletions: ghData.stats.deletions,
    code_message: ghData.commit.message,
    code_sha: ghData.sha,
    site_updated_at: Date.parse(ghData.commit.committer.date),
};

const newDailyCurrent = {
    site_updates: nwData.updates,
    followers: nwData.followers,
    views: nwData.views,
};

stats.hourly = newHourlyCurrent;

if (!stats.daily[dayNow]) {
    stats.daily[dayNow] = newDailyCurrent;
}

fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf-8");