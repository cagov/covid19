const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {

  eleventyConfig.addCollection("covidGuidance", function(collection) {
    let posts = [];
    collection.getAll().forEach( (item) => {
      if(item.data.tags[0] == 'guidancefeed') {
        posts.push(item);
      }
    })
    return posts.sort(function(a, b) {
      return new Date(a.data.publishdate) - new Date(b.data.publishdate);
    }).reverse();
  });


  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Format dates within templates.
  eleventyConfig.addFilter('formatDate', function(datestring) {
    const date = new Date(datestring);
    const locales = 'en-US';
    const timeZone = 'America/Los_Angeles';
    return `${date.toLocaleDateString(locales, { timeZone, day: 'numeric', month: 'long', year: 'numeric' })} at ${date.toLocaleTimeString(locales, { timeZone, hour: 'numeric', minute: 'numeric' })}`;
  });

  const contentfrompage = (content, page, slug) => page.fileSlug.toLocaleLowerCase()===slug.toLocaleLowerCase() ? content : "";

  // return the active class for a matching string
  eleventyConfig.addFilter('pageActive', (page, slug) => contentfrompage(" active", page, slug));

  // show or hide content based on page
  eleventyConfig.addPairedShortcode("pagesection", contentfrompage);

  eleventyConfig.addFilter('contentfilter', code => code);
      //.replace(/COVID-19/g,'COVID&#8288;-&#8288;19'));

  eleventyConfig.htmlTemplateEngine = "njk";
};

