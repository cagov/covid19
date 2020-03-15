const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {

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

  // return the active class for a matching string
  eleventyConfig.addFilter('pageActive', function(pageslug,pagelink) {
    return pageslug.toLocaleLowerCase()===pagelink.toLocaleLowerCase() ? " active" : "";
  });

  // show or hide content based on page
  eleventyConfig.addPairedShortcode("pagesection", function(content, pageslug, sectionslug) { 
    return pageslug.toLocaleLowerCase()===sectionslug.toLocaleLowerCase() ? content : "";
  });


  eleventyConfig.htmlTemplateEngine = "njk";
};

