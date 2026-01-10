import fs from "fs";
import path from "path";

const hourlyStatsPath = path.join(process.cwd(), "data", "hourly_stats.json");
const dailyStatsPath = path.join(process.cwd(), "data", "daily_stats.json");

const hStats = JSON.parse(fs.readFileSync(hourlyStatsPath, "utf-8"));
const dStats = JSON.parse(fs.readFileSync(dailyStatsPath, "utf-8"));

const github = await fetch('https://api.github.com/repos/Pufikas/pufikas-website/commits/dev');
const nekoweb = await fetch('https://nekoweb.org/api/site/info/pufikas.nekoweb.org');

const ghData = await github.json();
const nwData = await nekoweb.json();

const now = new Date().toISOString();

const newHourlyCurrent = {
    generated_at: now,
    site_updates: nwData.updates,
    followers: nwData.followers,
    views: nwData.views,
    code_additions: ghData.stats.additions,
    code_deletions: ghData.stats.deletions,
    site_updated_at: Date.parse(ghData.commit.committer.date),
};

const newDailyCurrent = {
    site_updates: nwData.updates,
    followers: nwData.followers,
    views: nwData.views,
};

fs.writeFileSync(hStats, JSON.stringify(newHourlyCurrent, null, 2));

dStats[now] = newDailyCurrent;
fs.writeFileSync(dailyStatsPath, JSON.stringify(dStats, null, 2));