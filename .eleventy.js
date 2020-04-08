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

  eleventyConfig.addFilter('contentfilter', html => { return html });

  eleventyConfig.addFilter('contentfilter2', html => { //return html });
    const document = new JSDOM(`<fragment>${html}</fragment>`).window.document;

    const data = tableToJson(document);
 
    console.log(JSON.stringify(data,null,2));

//    document.querySelectorAll('ul.magic-footer').forEach(target => {      
//      target.querySelectorAll('li').forEach(li => {
//        li.setAttribute('class','list-group-item alpha-footer');
//      });

//      target.setAttribute('class','list-group list list-group-horizontal-lg flex-fill list-group-flush');

//      let html = `<div class="footer alpha-footer"><div class="container"><div class="row"><div class="col-md-12">${target.outerHTML}</div></div></div></div>`;
//      target.outerHTML = html;
//    });

//    document.querySelectorAll('p.magic-footer').forEach(target => {      
//      target.querySelectorAll('a').forEach(li => {
//        li.setAttribute('class','pr-3');
//      });

//      target.setAttribute('class','list-group list list-group-horizontal-lg flex-fill list-group-flush');

//      let html = `<div class="footer alpha-footer"><div class="container"><div class="row"><div class="col-md-12">${target.outerHTML}</div></div></div></div>`;
//      target.outerHTML = html;
//    });

    return document.querySelector('fragment').innerHTML;
  });


      //.replace(/COVID-19/g,'COVID&#8288;-&#8288;19'));

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


function tableToJson(document) {
  const data = {};

  document.querySelectorAll('table').forEach(table => {
    const rows = [];
    const headers = [];
    let tableindex = 1;

    table.querySelectorAll('thead tr').forEach(target => {
      target.childNodes.forEach(x=>headers.push(x.innerHTML));
    });

    table.querySelectorAll('tbody tr').forEach(target => {
      const rowdata = {};
      target.childNodes.forEach((x,i)=>rowdata[headers[i]] = x.innerHTML);
      rows.push(rowdata);
    });

    data[`Table ${tableindex++}`] = rows;
  });

  return data;
}