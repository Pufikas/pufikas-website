module.exports = class {
  data() {
    return {
      permalink: "/blogs.json",
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {
    const posts = data.collections.all
      .filter(p => p.inputPath.includes("/blogs/"))
      .map(p => ({
        id: p.data.id,
        file: p.url.replace("/blogs/", ""),
        tags: p.data.tags,
        title: p.data.title,
        intro: p.data.intro,
        date: p.data.date
      }));

    return JSON.stringify(posts, null, 2);
  }
};