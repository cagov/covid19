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

  eleventyConfig.htmlTemplateEngine = "njk";
};

