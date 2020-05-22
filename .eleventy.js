const CleanCSS = require("clean-css");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const md5 = require('md5');
const langData = JSON.parse(fs.readFileSync('pages/_data/langData.json','utf8'));
const pageNav = JSON.parse(fs.readFileSync('pages/_data/pageNav.json','utf8'));
const statsData = JSON.parse(fs.readFileSync('pages/_data/caseStats.json','utf8')).Table1[0];
let htmlmap = [];
if(fs.existsSync('pages/_data/htmlmap.json')) {
  htmlmap = JSON.parse(fs.readFileSync('pages/_data/htmlmap.json','utf8'));
}
let miniCSS = '';

module.exports = function(eleventyConfig) {
  //Copy static assets
  eleventyConfig.addPassthroughCopy({ "./src/css/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "./src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "./src/pdf": "pdf" });
  eleventyConfig.addPassthroughCopy({ "./src/js/maps": "js/maps" });
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

  //Process translated posts
  let translatedPaths = []
  eleventyConfig.addCollection("translatedposts", function(collection) {
    const FolderName = 'translated-posts';
    let output = [];
    
    collection.getAll().forEach(item => {
        if(item.inputPath.includes(FolderName)) {
          item.outputPath = item.outputPath.replace(`/${FolderName}`,'');
          translatedPaths.push(item.outputPath);
          item.url = item.url.replace(`/${FolderName}`,'');
          item.data.page.url = item.url;
          output.push(item);

          if(!item.data.title) {
            //No title means fragment
            // console.log(`Skipping fragment ${item.inputPath}`)
            item.outputPath = false;
          }
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
          let outputPath = item.outputPath.replace(`/${FolderName}`,'');
          if(translatedPaths.indexOf(outputPath) === -1) {
            //This page is not in the AvantPage list
            item.outputPath = outputPath;
            item.url = item.url.replace(`/${FolderName}`,'');
            item.data.page.url = item.url;
            output.push(item);

            if(!item.data.title) {
              //No title means fragment
              // console.log(`Skipping fragment ${item.inputPath}`)
              item.outputPath = false;
            }
          } else {
            //Turn this page off since we already have a translation
            output.push(item);
            item.outputPath = false;
            // console.log(`Skipping traslated page ${item.inputPath}`)
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
    if(!miniCSS) {
      miniCSS = new CleanCSS({}).minify(code).styles;
    }
    return miniCSS;
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

  eleventyConfig.addFilter('_statsdata_', index => Object.values(statsData)[index]);
  //Usage...
  //        {{0|_statsdata_}}

  const contentfrompage = (content, page, slug) => {
    if(page.fileSlug && slug && page.fileSlug.toLocaleLowerCase()===slug.toLocaleLowerCase()) {
      return content;
    }
    return "";
  }

  const getTranslatedValue = (pageObj, tags, field) => {
    
    let langTag = getLangRecord(tags);
    
    if(!pageObj)
      return "";

    if(pageObj[langTag.wptag] && pageObj[langTag.wptag][field]) {
      return pageObj[langTag.wptag][field];
    } 
    //that page is missing for that lang, bring in the default
    return pageObj[getLangRecord([]).wptag][field];
  }

  // return the active class for a matching string
  eleventyConfig.addFilter('pageActive', (page, tags, pageObj) => contentfrompage(" active", page, getTranslatedValue(pageObj, tags, 'slug')));

  // return the translated url or title if appropriate
  eleventyConfig.addFilter('getTranslatedVal', getTranslatedValue);
  
  
  // show or hide content based on page
  eleventyConfig.addPairedShortcode("pagesection", contentfrompage);

  function localizeUrl(url, lang) {
    if(url.indexOf('_en.') > -1) {
      return url.replace('_en.',`_${lang}.`)
    }
    return url;
  }
  eleventyConfig.addTransform("findimagestolocalize", function(html, outputPath) {
    const imageclass = 'localize-me';
    if(outputPath&&outputPath.endsWith(".html")&&html.indexOf(imageclass)>-1) {
      const dom = new JSDOM(html);
      const document = dom.window.document;

      let lang = langData.languages.filter(x=>x.enabled&& document.querySelector('html').lang == x.hreflang).concat(langData.languages[0])[0].id;

      if(lang !== "en") {
        for(const image of document.querySelectorAll(`.${imageclass}`)) {
          image.classList.remove(imageclass);
          if (image.classList.length===0) image.removeAttribute('class');
          if(image.nodeName === "FIGURE") {
            image.querySelectorAll('img').forEach(internalImg => {
              internalImg.src = localizeUrl(internalImg.src, lang);
            })
            image.querySelectorAll('source').forEach(internalImg => {
              internalImg.srcset = localizeUrl(internalImg.srcset, lang);
            })
          }
          if(image.nodeName === "IMG") {
            image.src = localizeUrl(image.src, lang);
          }
        }
        return dom.serialize();  
      }
    }
    return html;
  });

  let processedPostMap = new Map();
  htmlmap.forEach(pair => {
    processedPostMap.set(pair[0],pair[1])
  })
  eleventyConfig.addTransform("findaccordions", function(html, outputPath) {
    const headerclass = 'wp-accordion';
    const contentclass = 'wp-accordion-content';

    if(outputPath&&outputPath.endsWith(".html")&&html.indexOf(headerclass)>-1) {
      let initialHTML = md5(html);
      if(processedPostMap.get(outputPath)!==initialHTML) {
        const dom = new JSDOM(html);
        const document = dom.window.document;

        for(const header of document.querySelectorAll(`.${headerclass}`)) {
          //create the wrapper element and wrap it around the header
          const cwdscontainer = document.createElement('cwds-accordion');
          const container = document.createElement('div');
          container.classList.add('card');
          cwdscontainer.appendChild(container);

          header.parentNode.insertBefore(cwdscontainer, header);
          container.appendChild(header);

          //remove the special wp class
          header.classList.remove(headerclass);
          if (header.classList.length===0) header.removeAttribute('class');

          //create the card body section and add it to the container
          const body = document.createElement('div');
          body.className="card-body";
          container.appendChild(body);

          //Add all remaining content classes to the card body, they must be directly after the new container
          let direct;
          while (direct = document.querySelector(`cwds-accordion + .${contentclass}`)) {
            body.appendChild(direct);

            //remove custom class name
            direct.classList.remove(contentclass);
            if (direct.classList.length===0) direct.removeAttribute('class');
          }

          //apply required html around components
          header.outerHTML=`
            <button class="card-header accordion-alpha" type="button" aria-expanded="false">
              <div class="accordion-title">
                ${header.outerHTML}
              </div>
            </button>`;

          body.outerHTML = `
            <div class="card-container" aria-hidden="true" style="height: 0px;">
              ${body.outerHTML}
            </div>`;
        }
        processedPostMap.set(outputPath,initialHTML);
        fs.writeFileSync('./pages/_data/htmlmap.json',JSON.stringify([...processedPostMap]),'utf8')
        return dom.serialize();
      }
    }
    return html;
  });



  eleventyConfig.addFilter('jsonparse', json => JSON.parse(json));
  eleventyConfig.addFilter('includes', (items,value) => (items || []).includes(value));

  const getLangRecord = tags =>
    langData.languages.filter(x=>x.enabled&&(tags || []).includes(x.wptag)).concat(langData.languages[0])[0];
  const getLangCode = tags => 
    getLangRecord(tags).hreflang;

  eleventyConfig.addFilter('lang', getLangCode);
  eleventyConfig.addFilter('langRecord', getLangRecord);
  eleventyConfig.addFilter('langFilePostfix', tags => getLangRecord(tags).filepostfix.toLowerCase() || "");
  eleventyConfig.addFilter('htmllangattributes', tags => {
    const langRecord = getLangRecord(tags);
    return `lang="${langRecord.hreflang}" xml:lang="${langRecord.hreflang}"${(langRecord.rtl ? ` dir="rtl"` : "")}`;
  });

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
    const pageNavRecord = pageNav.navList.find(f=>langData.languages.find(l=>f[l.wptag]&&f[l.wptag].slug===page.fileSlug));
    if(pageNavRecord) {
      return langData.languages
        .filter(x=>x.enabled&&pageNavRecord[x.wptag]&&pageNavRecord[x.wptag].slug!==page.fileSlug&&pageNavRecord[x.wptag].url)
        .map(x=>({
          langcode:x.id,
          langname:x.name,
          url:pageNavRecord[x.wptag].url
        }));
      }
  });

  eleventyConfig.htmlTemplateEngine = "njk,findaccordions";
};

