import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://pufikas.nekoweb.org";
const blogHash = "#blogs?post=";

const blogsPath = path.resolve(__dirname, "../../blogs/blogs.json");
const blogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));

// sort newest first
blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

// to rss date format
function toRfc822(dateStr) {
    return new Date(dateStr).toUTCString();
}

let items = blogs.map(post => `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <description><![CDATA[${post.intro}]]></description>
            <link>${SITE_URL}/${blogHash}${post.id}</link>
            <guid>${post.id}</guid>
            <pubDate>${toRfc822(post.date)}</pubDate>
        </item>
`).join("");

const rss = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
        <channel>
            <title>posts from pufikas</title>
            <description>my real posts</description>
            <link>${SITE_URL}</link>
            ${items}
        </channel>
    </rss>
`;

fs.writeFileSync("../../rss.xml", rss.trim());
console.log("rss.xml generated");
