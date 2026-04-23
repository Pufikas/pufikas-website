---
layout: blog.njk
id: post-5
title: Creating your own LastFm last played widget
date: 2026-04-22T18:14:52
tags: dev
intro: A guide on how to build a small serverless API using Netlify that fetches your most recently played track from Lastfm and displays it on your website
permalink: /blogs/post-5.html
---

![currently playing](src/blogs/img/currplaying.png){.center .auto-margin}

It is important to note that I will be covering how I made this and how I use it.

I will cover steps in this order:
1. Getting a [Last.fm](https://www.last.fm/api) API key.
2. Setting up Netlify functions.
3. Writing the API function.
4. Using the data on your site.


Let's start with the easiest step: getting a Last.fm API key. Go over to [Last.fm](https://www.last.fm/api/account/create) to obtain your API key and save it somewhere for now. Then install a web extension for your browser. In my case, I used [Web Scrobbler](https://addons.mozilla.org/en-US/firefox/addon/web-scrobbler/) for Firefox open the extension's settings and login with your last.fm account. After you’ve done that, try listening to some music from your choice of audio service provider (spotify, soundcloud or anything else that your scrobbler supports!) remember the scrobbler will show after x% of song has passed.
![scrobbler](src/blogs/img/scrob.png){.width100}
the end result should look like this 
![scrobbres](src/blogs/img/scrob2.png){.width50}
_you need to click on the extension to see the popup._

We are using [Netlify](https://www.netlify.com/) and its functions because it lets us run backend code without having a server and we don't want to expose our Last.fm API key in the frontend.

So lets move to setting your api repository, create a repository whatever you use (github, gitlab, codeberd etc..) in this example we will use [netlify](https://www.netlify.com/) so go ahead and create an account (or use your existing one) once you are logged click on a `Create Project` button
then import from a repository
![netlify create project](src/blogs/img/createproj.png){.width100}

if you made your repository private (like i did) you will see no git repositories listed, so you will need to configure the netlify app
![netlify select repo](src/blogs/img/selectrepo.png){.width100}
if everything went well you should add your `Last.fm` API key we got earlier! Select your project and navigate to `Environment variables`
![Netlify environment variables](src/blogs/img/envvar.png){.width100}
add a key with name `LASTFM_API_KEY` make sure to toggle the `Contains secret values` to true! In the values field input your actual API key and you are done!

Next step is to create a `netlify/functions` folder on our repository and inside `functions` folder create a `lastfm.js` file with following code


<details open>
    <summary class="highlight">simplified lastfm.js</summary>

```js
export const handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // handle preflight
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers
        };
    }

    const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=pufikas727&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=1`
    );

    if (!response.ok) {
        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify({ error: "Failed to fetch data" })
        };
    }

    const data = await response.json();
    const track = data.recenttracks.track[0];

    const cleanData = {
        artist: track.artist?.["#text"] ?? null,
        name: track.name ?? null,
        nowPlaying: track["@attr"]?.nowplaying === "true",
        cover: track.image?.find(img => img.size === "large")?.["#text"] ?? null,
        playedAt: track.date?.uts ? Number(track.date.uts) : null
    };

    return {
        statusCode: 200,
        headers: {
            ...headers,
            "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
        },
        body: JSON.stringify(cleanData)
    };
};
```
</details>

<details>
    <summary class="highlight">click me for lastfm.js code with cors.js logic</summary>

```js
import { applyCors } from "../../lib/cors.js";

export const handler = async (event, context) => {
    const cors = applyCors(event);

    if (event.httpMethod === "OPTIONS") {
        return cors;
    }

    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=pufikas727&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=1`);

    if (!response.ok) {
        return {
            statusCode: response.status,
            headers: cors.headers
        };
    }

    const data = await response.json();
    const track = data.recenttracks.track[0];

    const cleanData = {
        artist: track.artist?.["#text"] ?? null,
        name: track.name ?? null,
        nowPlaying: track["@attr"]?.nowplaying == "true",
        cover: track.image?.find(img => img.size == "large")?.["#text"] ?? null,
        playedAt: track.date?.uts ? Number(track.date.uts) : null
    };

    return {
        statusCode: 200,
        headers: {
            ...cors.headers,
            "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
        },
        body: JSON.stringify(cleanData)
    };
};
```
</details>

> Note replace user=pufikas727 with your own username.


we use [Optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) to safely return an undefined or null value if the fetch was unsuccesful instead of our app crashing, then linking it with [Nullish coalescing operator (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) to return a value if the left return is undefined with our own, in this case I return `null`.


<details>
    <summary class="highlight">click me for explanation of cors.js and it's use case</summary>

`cors.js` file is located at root repo inside `lib` folder

```js
export function applyCors(event) {
    const allowed = [
        /^https?:\/\/localhost(:\d+)?$/, // dev
        /^https:\/\/pufikas\.nekoweb\.org$/ // production
    ];

    const origin = event.headers.origin;

    const headers = {
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (origin && allowed.some(pattern => pattern.test(origin))) {
        headers["Access-Control-Allow-Origin"] = origin;
    }

    // handle preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers };
    }

    return {
        headers,
        isPreflight: event.httpMethod === "OPTIONS"
    };
}
``` 
but let's understand why do we need this and how it works
```js
    const allowed = [
        /^https?:\/\/localhost(:\d+)?$/, // dev
        /^https:\/\/pufikas\.nekoweb\.org$/ // production
    ];
```
is basically a whitelist of what origins can call our API's functions, so in this case we only want to accept local development and our main website origins, we do this regex to match the origin here's [regex101.com](https://regex101.com/) example and you can read more about the various expressions used
![regex expression](src/blogs/img/regexpression.png){.width100}
make sure to change your regex to your own website and check if the regex matches the string, to see your own origin go to your deployed website [web console](https://firefox-source-docs.mozilla.org/devtools-user/web_console/index.html) _(keybind Ctrl + Shift + K)_
and console log your origin
![origin](src/blogs/img/originweb.png){.width100}

before sending certain requests, the browser sends a "preflight" request using the `OPTIONS` method to check what is allowed. We simply respond with `200` (success) so the browser knows it's safe to continue (assuming the request passed the `allowed` filter)
```js
if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
}
```
In this example, the request is simple enough that preflight may not always occur, but it's still good practice to handle `OPTIONS` requests.
</details>

Our final file structure should look like this.
![file structure](src/blogs/img/filestruct.png){.width100}
so go ahead and push to your repository and go back to Netlify and navigate to `Functions` tab
![netlify functions](src/blogs/img/netfunc.png){.width100}
open up your lastfm function and copy the endpoint, this will be used in our frontend to fetch the data from lastfm, you can test it yourself to see if there is any data if you play music
![endpoint netlify](src/blogs/img/resnetlifylastfm.png){.width100}
> Note that Netlify automatically exposes your function at
> /.netlify/functions/<filename>

so let's get our frontend done!
somewhere inside your website JavaScript create a function to fetch our Netlify lastfm endpoint
```js
async function fetchLastFM() {
    try {
        const res = await fetch("https://pufikasapistuff.netlify.app/.netlify/functions/lastfm");
        const track = await res.json();

        updateLastfmPanel(track);

        scheduleNextLastfmFetch(track.nowPlaying);
    } catch (err) {
        console.error("Error fetching Last.fm:", err);
        setTimeout(fetchLastFM, 60000);
    }
}
```
here we try to fetch our endpoint and if it fails we simply try again in a minute, we also call `scheduleNextLastfmFetch` which simply sets our next fetch request depending if we are currently listening to a song

```js
function scheduleNextLastfmFetch(isPlaying) {
    const interval = isPlaying ? 20000 : 120000;
    setTimeout(fetchLastFM, interval);
}
```
so if the track has `"nowPlaying":true` our next fetch will occur in 20 seconds else we default to 120 seconds

to actually update our recently played we call `updateLastfmPanel(track)`
```js
function updateLastfmPanel(track) {
    const played = document.getElementById("lastfm-playingstatus");
    const lastfmtrack = document.getElementById("lastfm-track");
    const lastfmartist = document.getElementById("lastfm-artist")
    const coverArt = document.querySelector("#lastfm-listening-cover img");

    if (track.cover) {
        coverArt.src = track.cover;
    } else {
        coverArt.src = "./assets/misc/mikudance.gif";
    }

    if (!track.nowPlaying && track.playedAt) {
        played.textContent = formatTimeAgo(track.playedAt);
    } else {
        played.textContent = "Currently playing";
    }

    lastfmartist.textContent = track.artist;
    lastfmtrack.textContent = track.name;
}
```
for simplicity inside your `index.html` add the lastfm panel like this
```html
<div id="lastfm">
    <div id="lastfm-listening-cover">
        <img class="lastfm-audio-cover">
    </div>

    <div id="lastfm-trackinfo">
        <p id="lastfm-playingstatus"></p>
        <p id="lastfm-track"></p>
        <p id="lastfm-artist"></p>
    </div>
</div>
```

if the track has cover we display it else we use our own, also it's important to note that if data has `"playedAt":null` this means we are currently playing the song so in that case our textContent is `Currently playing` else we get `"playedAt":1776952057` in [unix seconds](https://www.epochconverter.com/) so to get time like `5 minutes ago` I use a `formatTimeAgo` function and pass the unix seconds to it.
```js
function formatTimeAgo(unixSeconds) {
    const now = Date.now();
    const past = unixSeconds * 1000;
    const diff = Math.floor((past - now) / 1000); // difference in seconds (negative)

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const divisions = [
        { amount: 60, name: "seconds" },
        { amount: 60, name: "minutes" },
        { amount: 24, name: "hours" },
        { amount: 7, name: "days" },
        { amount: 4.34524, name: "weeks" },
        { amount: 12, name: "months" },
        { amount: Number.POSITIVE_INFINITY, name: "years" }
    ];

    let duration = diff;

    for (const division of divisions) {
        if (Math.abs(duration) < division.amount) {
            return rtf.format(Math.round(duration), division.name);
        }
        duration /= division.amount;
    }
}
```

And that is it for this guide/blog, if you managed to build this write to my guestbook I will gladly check your website!

Reference list:
- [Netlify](https://www.netlify.com/)
- [Last.fm](https://www.last.fm/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
