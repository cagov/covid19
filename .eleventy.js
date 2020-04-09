const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {
  //Copy static assets
  eleventyConfig.addPassthroughCopy({ "./src/css/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "./src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "./src/pdf": "pdf" });
  eleventyConfig.addPassthroughCopy({ "./pages/rootcopy": "/" });

  //Process manual content folder
  eleventyConfig.addCollection("manualcontent", function(collection) {
    const manualContentFolderName = 'manual-content';
    let output = [];
    collection.getAll().forEach(item => {
      if(item.inputPath.includes(manualContentFolderName)) {
        item.outputPath = item.outputPath.replace(`/${manualContentFolderName}`,'');
        item.url = item.url.replace(`/${manualContentFolderName}`,'');
        output.push(item);
      };
    });

    return output;
  });

  //Process wordpress posts
  eleventyConfig.addCollection("wordpressposts", function(collection) {
    const FolderName = 'wordpress-posts';
    let output = [];
    
    collection.getAll().forEach(item => {
        if(item.inputPath.includes(FolderName)) {
          item.outputPath = item.outputPath.replace(`/${FolderName}`,'');
          item.url = item.url.replace(`/${FolderName}`,'');
          item.data.page.url = item.url;
          output.push(item);

          if(!item.data.title) {
            //No title means fragment
            console.log(`Skipping fragment ${item.inputPath}`)
            item.outputPath = false;
          }
        };
    });

    return output;
  });

  eleventyConfig.addCollection("covidGuidance", function(collection) {
    let posts = [];
    collection.getAll().forEach( (item) => {
      if(item.data.tags && item.data.tags[0] == 'guidancefeed') {
        posts.push(item);
      }
    })
    return posts.slice().sort(function(a, b) {
      let bPub = new Date(b.data.publishdate);
      let aPub = new Date(a.data.publishdate)
      return bPub.getTime() - aPub.getTime();
    });
  });

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Format dates within templates.
  eleventyConfig.addFilter('formatDate', function(datestring) {
    if(datestring&&datestring.indexOf('Z') > -1) {
      const date = new Date(datestring);
      const locales = 'en-US';
      const timeZone = 'America/Los_Angeles';
      return `${date.toLocaleDateString(locales, { timeZone, day: 'numeric', month: 'long', year: 'numeric' })} at ${date.toLocaleTimeString(locales, { timeZone, hour: 'numeric', minute: 'numeric' })}`;
    } else {
      return datestring;
    }
  });

  eleventyConfig.addFilter('truncate220', function(textstring) {
    if(!textstring || textstring.length <221) {
      return textstring;
    } else {
      return textstring.slice(0,220)+'...';
    }
  });

  const contentfrompage = (content, page, slug) => page.fileSlug.toLocaleLowerCase()===slug.toLocaleLowerCase() ? content : "";

  // return the active class for a matching string
  eleventyConfig.addFilter('pageActive', (page, slug) => contentfrompage(" active", page, slug));

  // show or hide content based on page
  eleventyConfig.addPairedShortcode("pagesection", contentfrompage);

  eleventyConfig.addFilter('contentfilter', code => code);
      //.replace(/COVID-19/g,'COVID&#8288;-&#8288;19'));

  eleventyConfig.addFilter('jsonparse', json => JSON.parse(json));

  eleventyConfig.addFilter('lang', tags => (tags || []).includes('lang-es') ? 'es-ES' : 'en-US');

  eleventyConfig.addFilter('publishdateorfiledate', page => 
    (page.data
      ? page.data.publishdate
      : page.publishdate) 
      || page.date.toISOString()
  );
  
  eleventyConfig.addPairedShortcode("dothisifcontentexists", (content, contentcontent, match) => 
    contentcontent.match(match) ? content : "");

  eleventyConfig.htmlTemplateEngine = "njk";
};
