const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);

    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: false,
        typographer: true
    }).use(markdownItAttrs)
    .use(markdownItAnchor);
    
    eleventyConfig.ignores.add("index.html");
    eleventyConfig.ignores.add("not_found.html");

    eleventyConfig.setLibrary("md", md);
};