---
layout: blog.njk
id: post-4
title: Blog Rework
date: 2026-04-20T19:00:36
tags: upd,dev
intro: Blogs are now beautified!
permalink: /blogs/post-4.html
---

Completly revamped how blogs are proccesed
Now I can use md markdown and code syntax styling!
For example check out this `pop` function

can you guess what this does?
```js
function pop(e) {
    for (let i = 0; i < particleCount; i++) {
        createExplosionParticle(e.clientX, e.clientY);
    }
}
```
it calls a createExplosioNparticle with current client mouse position the function first creates a div element to house a particle with
```js
const particle = document.createElement("div");
```
then we set the styles for the particles
```js
  particle.style.width = particleSize + "px";
  particle.style.height = particleSize + "px";
  particle.classList.add("popParticle");
  particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
```
keep in mind this is different for every particle as we loop through `particleCount`

the popParticle is quite simple
```css
.popParticle {
    position: fixed;
    /* heart */
    clip-path: polygon(50% 15%, 61% 6%, 75% 6%, 85% 15%, 85% 30%, 50% 60%, 15% 30%, 15% 15%, 25% 6%, 39% 6%); 
    left: 0;
    top: 0;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
}
```
the particle shape is created by clip-path, I simply found a clip path for heart and used it

```js
function expandBlog(e) {
    ...code ommited...
    pop(e);
    ...code ommited...
}
```

it's used for expanding a blog! just like you did for this one!