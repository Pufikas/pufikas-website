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
it calls `createExplosioNparticle` function with current client mouse (x, y) position the function first creates a div element to house a particle with
```js
const particle = document.createElement("div");
```
After that, set the styles for the particles and keep in mind this is different for every particle because we loop through `particleCount` which is at default set to 30.
```js
particle.style.width = particleSize + "px";
particle.style.height = particleSize + "px";
particle.classList.add("popParticle");
particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
```

this line makes sure the HSL hue range is being restricted to a blue-cyan spectrum (180-270 degree range)
```js
particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
```

the class for `popParticle` is quite simple, using a clip path for heart like shape and next is setting the necessary styles like `pointe-events` and making sure it's position is fixed 
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
I use this effect for expanding a blog, clicking on some buttons.. you've already seen this effect by expanding this blog post!
```js
function expandBlog(e) {
    ...code ommited...
    pop(e);
    ...code ommited...
}
```

That concludes my fun explosion particle effect and this test of my new blog posts! Thank you for reading!