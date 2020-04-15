const CleanCSS = require("clean-css");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs')
const langData = JSON.parse(fs.readFileSync('pages/_data/langData.json','utf8'));
const pageNav = JSON.parse(fs.readFileSync('pages/_data/pageNav.json','utf8'));

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
  const getPageNavDetails = matchUrl => 
    pageNav.navList.find(obj => obj.url === matchUrl);

  const getTranslatedValue = (tags, matchUrl, field) => {
    let langTag = isTranslated(tags);
    let pageObj = getPageNavDetails(matchUrl)
    
    if(langTag && pageObj && pageObj[langTag] && pageObj[langTag][field]) {
      return pageObj[langTag][field];
    } 
    if(pageObj && pageObj[field]) {
      return pageObj[field];
    }
    return "";
  }

  // return the active class for a matching string
  eleventyConfig.addFilter('pageActive', (page, tags, matchUrl, field) => contentfrompage(" active", page, getTranslatedValue(tags, matchUrl, field)));

  // return the translated url or title if appropriate
  eleventyConfig.addFilter('getTranslatedVal', (page, tags, matchUrl, field) => {
    return getTranslatedValue(tags, matchUrl, field);
  });
  
  // show or hide content based on page
  eleventyConfig.addPairedShortcode("pagesection", contentfrompage);

  eleventyConfig.addFilter('contentfilter', code => code);
      //.replace(/COVID-19/g,'COVID&#8288;-&#8288;19'));

  eleventyConfig.addFilter('findaccordions', html => {
    const dom = new JSDOM(html);
    dom.window.document.querySelectorAll('.cwds-accordion').forEach( (accordion) => {
      // bunch of weird hax to make custom elements out of wordpress content
      if(accordion.querySelector('h4')) {
        let titleVal = accordion.querySelector('h4').innerHTML;
        let target = accordion.querySelector('h4').parentNode;
        accordion.querySelector('h4').remove();
        accordion.querySelector('.wp-block-group__inner-container').classList.add('card')
        let container = accordion.querySelector('.card-container');
        if(!container) {
          container = accordion.querySelector('ul');
        }
        if(container) {
          let containerContent = container.innerHTML;
          container.parentNode.insertAdjacentHTML('beforeend',`
            <div class="card-container" aria-hidden="true" style="height: 0px;">
              <div class="card-body">${containerContent}</div>
            </div>`);
          container.parentNode.removeChild(container);
          target.insertAdjacentHTML('afterbegin',`<button class="card-header accordion-alpha" type="button" aria-expanded="false">
            <div class="accordion-title">
            <h4>${titleVal}</h4>
            </div>
            </button>`)
          let html = `<cwds-accordion>${accordion.innerHTML}</cwds-accordion>`;
          accordion.innerHTML = html;  
        }
      }
    })
    return dom.serialize();
  });
  eleventyConfig.addFilter('jsonparse', json => JSON.parse(json));

  function gimmeLangs(tags) {
    return tags.filter((tag) => {
      return tag.indexOf('lang-') > -1;
    })
  }

  eleventyConfig.addFilter('getLangFromTags', tags => {
    if(tags && gimmeLangs(tags).length > 0) {
      return gimmeLangs(tags)[0].replace('lang','');
    }
    return "";
  });

  const getLangRecord = tags => 
    langData.languages.filter(x=>(tags || []).includes(x.wptag)).concat(langData.languages[0])[0];
  const getLangCode = tags => 
    getLangRecord(tags).hreflang;

  eleventyConfig.addFilter('lang', getLangCode);

  eleventyConfig.addFilter('publishdateorfiledate', page => 
    (page.data
      ? page.data.publishdate
      : page.publishdate) 
      || page.date.toISOString()
  );
  
  eleventyConfig.addPairedShortcode("dothisifcontentexists", (content, contentcontent, match) => 
    contentcontent.match(match) ? content : "");

  // return the page record in pageNav
  eleventyConfig.addFilter('getAltPageRows', (page, tags) => {
    const pageNavRecord = pageNav.navList.find(x=>x.slug===page.fileSlug || x['lang-es'].slug===page.fileSlug);
    const lang = getLangCode(tags);
    let list = [];

    if(pageNavRecord) {
      if (lang==='es-ES') {
        list.push({
            langcode:'en',
            langname:'English',
            url:pageNavRecord.url
          });
      } else {
        const url = pageNavRecord['lang-es'].url;

        if (url) 
          list.push({
            langcode:'es',
            langname: 'Español',
            url
          });
        }
      }

      return list;
  });

  eleventyConfig.htmlTemplateEngine = "njk";
};

