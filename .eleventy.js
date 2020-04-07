const CleanCSS = require("clean-css");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = function(eleventyConfig) {
  //Copy static assets
  eleventyConfig.addPassthroughCopy({ "./src/css/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "./src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "./src/pdf": "pdf" });
  eleventyConfig.addPassthroughCopy({ "./pages/rootcopy": "/" });
  //azure-pipelines-staging.yml

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

  eleventyConfig.addCollection("telehealth", function(collection) {
    let posts = [];
    collection.getAll().forEach( (item) => {
      if(item.data.tags && item.data.tags.toString().indexOf('telehealth') > -1) {
        posts.push(item);
      }
    })
    return posts;
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
      return textstring.slice(0,220)+'...';
    }
    return textstring;
  });

  const contentfrompage = (content, page, slug) => {
    if(page.fileSlug && slug && page.fileSlug.toLocaleLowerCase()===slug.toLocaleLowerCase()) {
      return content;
    }
    return "";
  }

  const isTranslated = (tags) => {
    if(tags) {
      let langTag = tags.filter((str) => str.indexOf('lang-') === 0);
      if(langTag.length > 0) {
        return langTag[0];
      }
    }
    return false;
  }
  const getPageNavDetails = (pageNav, matchUrl) => {
    let filtered = pageNav.navList.filter((obj) => obj.url === matchUrl);
    if(filtered.length > 0) {
      return filtered[0];
    }
    return false;
  }

  const getTranslatedValue = (tags, pageNav, matchUrl, field) => {
    let langTag = isTranslated(tags);
    let pageObj = getPageNavDetails(pageNav, matchUrl)
    if(langTag && pageObj && pageObj[langTag] && pageObj[langTag][field]) {
      return pageObj[langTag][field];
    } 
    if(pageObj && pageObj[field]) {
      return pageObj[field];
    }
    return "";
  }

  // return the active class for a matching string
  eleventyConfig.addFilter('pageActive', (page, tags, pageNav, matchUrl, field) => contentfrompage(" active", page, getTranslatedValue(tags, pageNav, matchUrl, field)));

  // return the translated url or title if appropriate
  eleventyConfig.addFilter('getTranslatedVal', (page, tags, pageNav, matchUrl, field) => {
    return getTranslatedValue(tags, pageNav, matchUrl, field);
  });
  
  // show or hide content based on page
  eleventyConfig.addPairedShortcode("pagesection", contentfrompage);

  eleventyConfig.addFilter('contentfilter', code => code);
      //.replace(/COVID-19/g,'COVID&#8288;-&#8288;19'));

  eleventyConfig.addFilter('findaccordions', html => {
    // return html.replace('<div class="cwds-accordion">','<cwds-accordion>');
    // parse the dom with jsdom
    // let accordionContent = parsed.dom.querySelector('.cwds-accordion).innerHTML
    const dom = new JSDOM(html);
    dom.window.document.querySelectorAll('.cwds-accordion').forEach( (accordion) => {
      let html = `<cwds-accordion>${accordion.innerHTML}</cwds-accordion>`;
      accordion.innerHTML = html;
    })
    return dom.serialize();
  });

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