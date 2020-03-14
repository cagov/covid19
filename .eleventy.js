const CleanCSS = require("clean-css");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Format dates within templates.
  // https://moment.github.io/luxon/docs/manual/formatting.html
  eleventyConfig.addFilter('formatDate', function(date) {
    return DateTime.fromISO(date).toFormat("LLLL d',' yyyy 'at' t");
  });

  eleventyConfig.htmlTemplateEngine = "njk";
};