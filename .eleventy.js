const CleanCSS = require("clean-css");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs')
const langData = JSON.parse(fs.readFileSync('pages/_data/langData.json','utf8'));
const langWptagList = langData.languages.map(l=>l.wptag);
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

  const getTranslatedValue = (pageObj, tags, field) => {
    
    let langTag = getLangRecord(tags);

    if(pageObj && pageObj[langTag.wptag] && pageObj[langTag.wptag][field]) {
      return pageObj[langTag.wptag][field];
    } 
    return "";
  }

  // return the active class for a matching string
  eleventyConfig.addFilter('pageActive', (page, tags, pageObj) => contentfrompage(" active", page, getTranslatedValue(pageObj, tags, 'slug')));

  // return the translated url or title if appropriate
  eleventyConfig.addFilter('getTranslatedVal', getTranslatedValue);
  
  
  // show or hide content based on page
  eleventyConfig.addPairedShortcode("pagesection", contentfrompage);

  eleventyConfig.addTransform("findaccordions", function(html, outputPath) {
    if(outputPath&&outputPath.endsWith(".html")) {
      const dom = new JSDOM(html);
      const accordions = dom.window.document.querySelectorAll('.cwds-accordion');
      if(accordions.length>0) {
        accordions.forEach(accordion => {
          // bunch of weird hax to make custom elements out of wordpress content
          if(accordion.querySelector('h4')) {
            const titleVal = accordion.querySelector('h4').innerHTML;
            const target = accordion.querySelector('h4').parentNode;
            accordion.querySelector('h4').remove();
            accordion.querySelector('.wp-block-group__inner-container').classList.add('card');
            let container = accordion.querySelector('.card-container');
            if(!container) {
              container = accordion.querySelector('ul');
            }
            if(container) {
              const containerContent = container.innerHTML;
              container.parentNode.insertAdjacentHTML('beforeend',`
                <div class="card-container" aria-hidden="true" style="height: 0px;">
                  <div class="card-body">${containerContent}</div>
                </div>`);
              container.parentNode.removeChild(container);
              target.insertAdjacentHTML('afterbegin',`<button class="card-header accordion-alpha" type="button" aria-expanded="false">
                <div class="accordion-title">
                <h4>${titleVal}</h4>
                </div>
                </button>`);
              accordion.innerHTML = `<cwds-accordion>${accordion.innerHTML}</cwds-accordion>`;
            }
          }
        });
        return dom.serialize();
      }
    }
    return html;
  });
  eleventyConfig.addFilter('jsonparse', json => JSON.parse(json));

  const getLangRecord = tags => 
    langData.languages.filter(x=>(tags || []).includes(x.wptag)).concat(langData.languages[0])[0];
  const getLangCode = tags => 
    getLangRecord(tags).hreflang;

  eleventyConfig.addFilter('lang', getLangCode);
  eleventyConfig.addFilter('langRecord', getLangRecord);
  eleventyConfig.addFilter('htmllangattributes', tags => {
    const langRecord = getLangRecord(tags);
    
    return `lang="${langRecord.hreflang}" xml:lang="${langRecord.hreflang}"${(langRecord.rtl ? ` dir="rtl"` : "")}`;
  });
  //lang="{{ langRecord.hreflang }}" xml:lang="{{ langRecord.hreflang }}"{{ ' dir="rtl"' | safe if langRecord.rtl }}

  eleventyConfig.addFilter('publishdateorfiledate', page => 
    (page.data
      ? page.data.publishdate
      : page.publishdate) 
      || page.date.toISOString()
  );
  
  eleventyConfig.addPairedShortcode("dothisifcontentexists", (content, contentcontent, match) => 
    contentcontent.match(match) ? content : "");

  // return alternate language pages
  eleventyConfig.addFilter('getAltPageRows', (page, tags) => {
    const pageNavRecord = pageNav.navList.find(f=> langWptagList.find(l=>f[l].slug===page.fileSlug));
    if(pageNavRecord) {
      return langData.languages
        .filter(x=>pageNavRecord[x.wptag].slug!==page.fileSlug&&pageNavRecord[x.wptag].url)
        .map(x=>({
          langcode:x.id,
          langname:x.name,
          url:pageNavRecord[x.wptag].url
        }));
      }
  });

  eleventyConfig.htmlTemplateEngine = "njk,findaccordions";
};

