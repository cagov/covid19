const fs = require('fs');
const md5 = require('md5');
const langData = JSON.parse(fs.readFileSync('pages/_data/langData.json', 'utf8'));
const dateFormats = JSON.parse(fs.readFileSync('pages/_data/dateformats.json', 'utf8'));
let filesSiteData = [];

let htmlmap = [];
let htmlmapLocation = './pages/_buildoutput/htmlmap.json';
if (process.env.NODE_ENV === 'development' && fs.existsSync(htmlmapLocation)) {
  htmlmap = JSON.parse(fs.readFileSync(htmlmapLocation, 'utf8'));
}
const localizeString = '--en.';

//RegExp for removing language suffixes - /(?:-es|-tl|-ar|-ko|-vi|-zh-hans|-zh-hant)$/
const langPostfixRegExp = new RegExp(`(?:${langData.languages
  .map(x => x.filepostfix)
  .filter(x => x)
  .join('|')})$`);

const engSlug = page => page.inputPath.includes('/manual-content/homepages/')
  ? '' //This is a root language page
  : page.fileSlug.replace(langPostfixRegExp, '');

/**
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig 
 */
module.exports = function (eleventyConfig) {
  //Copy static assets
  eleventyConfig.addPassthroughCopy({ "./src/css/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "./src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "./src/js/maps": "js/maps" });
  eleventyConfig.addPassthroughCopy({ "./pages/rootcopy": "/" });
  //azure-pipelines-staging.yml

  //Process manual content folder
  eleventyConfig.addCollection("manualcontent", function (collection) {
    const manualContentFolderName = 'manual-content';
    let output = [];
    collection.getAll().forEach(item => {
      if (item.inputPath.includes(manualContentFolderName)) {
        item.outputPath = item.outputPath.replace(`/${manualContentFolderName}`, '');
        item.url = item.url.replace(`/${manualContentFolderName}`, '');
        item.data.page.fileSlug = item.data.page.fileSlug.replace(manualContentFolderName, '');
        item.data.page.url = item.data.page.url.replace(`/${manualContentFolderName}`, '');
        output.push(item);
      };
    });

    return output;
  });

  //Replaces content to rendered
  const replaceContent = (item, searchValue, replaceValue) => {
    item.template.frontMatter.content = item.template.frontMatter.content
      .replace(searchValue, replaceValue);
  }

  //Process translated posts
  let translatedPaths = []
  eleventyConfig.addCollection("translatedposts", function (collection) {
    const FolderName = 'translated-posts';
    let output = [];

    collection.getAll().forEach(item => {
      //fix all http/https links to covid sites
      replaceContent(item, /"http:\/\/covid19.ca.gov\//g, `"https://covid19.ca.gov/`);
      replaceContent(item, /"http:\/\/files.covid19.ca.gov\//g, `"https://files.covid19.ca.gov/`);
      replaceContent(item, /"https:\/\/covid19.ca.gov\/pdf\//g, `"https://files.covid19.ca.gov/pdf/`);
      replaceContent(item, /"https:\/\/covid19.ca.gov\/img\//g, `"https://files.covid19.ca.gov/img/`);

      if (item.inputPath.includes(FolderName)) {
        if (item.data.layout) {
          //for any layout pages in the translated posts folder
          const langRecordFromSlug = langData.languages.find(x => x.filepostfix && item.data.page.fileSlug.endsWith(x.filepostfix));

          if (!item.data.tags) {
            item.data.tags = [];
          }

          if (langRecordFromSlug && !item.data.tags.includes(langRecordFromSlug.wptag)) {
            //Add a lang record tag if it is missing based on the file slug
            item.data.tags.push(langRecordFromSlug.wptag);
          }
        }

        //update translated paths.
        const langrecord = getLangRecord(item.data.tags);
        const getTranslatedPath = path =>
          path
            .replace(`${langrecord.filepostfix}/`, `/`)
            .replace(`${FolderName}/`, `${langrecord.pathpostfix}`);

        //quick check to see if the tag matches the file name
        if (!item.url.endsWith(langrecord.filepostfix + '/')) {
          console.error(`lang tag does not match file name. ${item.url} ≠ ${langrecord.filepostfix} `);
        }

        replaceContent(item, /"https:\/\/covid19\.ca\.gov\//g, `"/${langrecord.pathpostfix}`);

        item.outputPath = getTranslatedPath(item.outputPath)
        translatedPaths.push(item.outputPath);
        item.url = getTranslatedPath(item.url);
        item.data.page.url = item.url;
        output.push(item);

        if (!item.data.title) {
          //No title means fragment
          //console.log(`Skipping fragment ${item.inputPath} for ${FolderName}`)
          item.template.isDryRun = true;
        }
      };
    });

    return output;
  });

  //Process wordpress posts
  eleventyConfig.addCollection("wordpressposts", function (collection) {
    const FolderName = 'wordpress-posts';
    let output = [];

    collection.getAll().forEach(item => {
      if (item.inputPath.includes(FolderName)) {
        let outputPath = item.outputPath.replace(`/${FolderName}`, '');
        if (translatedPaths.indexOf(outputPath) === -1) {
          //This page is not in the AvantPage list
          item.outputPath = outputPath;
          item.url = item.url.replace(`/${FolderName}`, '');
          item.data.page.url = item.url;
          output.push(item);

          if (!item.data.title) {
            //No title means fragment
            //console.log(`Skipping fragment ${item.inputPath} for ${FolderName}`)
            item.template.isDryRun = true;
          }
        } else {
          //Turn this page off since we already have a translation
          output.push(item);
          //console.log(`Skipping traslated page ${item.inputPath} for ${FolderName}`)
          item.template.isDryRun = true;
        }
      };
    });

    return output;
  });

  eleventyConfig.addCollection("covidGuidance", function (collection) {
    let posts = [];
    collection.getAll().forEach((item) => {
      if (item.data.tags && item.data.tags[0] == 'guidancefeed') {
        posts.push(item);
      }
    })
    return posts.slice().sort(function (a, b) {
      let bPub = new Date(b.data.publishdate);
      let aPub = new Date(a.data.publishdate)
      return bPub.getTime() - aPub.getTime();
    });
  });


  //usage
  //    {{ 'My Error message' | error }}
  eleventyConfig.addFilter('error', errorMessage => {
    if (errorMessage)
      throw errorMessage;
    else
      return null;
  }
  );

  /*
  Return TRUE if we need to suppress the daily totals in the summary boxes (displaying hyphens instead of numbers).
  This is currently extra conservative, we will remove some of these conditions when
  we understand the likely scenarios better.  We hope we can just use the zero test and the day_delta test.
   */
  eleventyConfig.addFilter("suppressDailyTotals", (sumdata) => {
    // Daily Tests (the highest of the three daily numbers) is zero?  The data wasn't counted
    // return false;
    // if (sumdata.data.tests.NEWLY_REPORTED_TESTS == 0) {
    //   console.log("New tests are zero");
    //   return true;
    // }
    // // Saturday or Sunday?
    // let publishWeekDay = new Date(sumdata.meta.PUBLISHED_DATE).getUTCDay();
    // if (publishWeekDay == 0 || publishWeekDay == 6) {
    //   console.log("weekend");
    //   return true;
    // }
    // // State Holiday?
    // if (sumdata.meta.PUBLISHED_DATE == '2021-07-05' || sumdata.meta.PUBLISHED_DATE == '2021-09-06') {
    //   console.log("holiday");
    //   return true;
    // }
    // Difference between publish date and test-data collection date is > 1 day?
    let day_delta = (new Date(sumdata.meta.PUBLISHED_DATE).getTime() - new Date(sumdata.data.tests.DATE).getTime()) / (1000 * 3600 * 24);
    if (day_delta > 1) {
      // console.log("day delta > 1");
      return true;
    }
    // console.log("All state-dashboard tests pass");
    return false;
  });

  eleventyConfig.addFilter('find', (array, field, value) => array.find(x => x[field] === value));

  //
  eleventyConfig.addFilter('formatNumber', (number, tags, fractionDigits = 3) => {
    const roundscale = Math.pow(10, fractionDigits);
    return addSeperator(Number.isInteger(number) ? number : Math.round(Number.parseFloat(number) * roundscale) / roundscale)
  }
  );
  eleventyConfig.addFilter('formatNumberFixed', (number, tags, fractionDigits = 3) => {
    let floatFormatter = new Intl.NumberFormat('us', // forcing US to avoid mixed styles on translated pages
      {
        style: 'decimal',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      });
    return floatFormatter.format(number);
  }
  );
  eleventyConfig.addFilter('formatNumberSmall', (number, tags) => {
    if (number < 0.005) {
      fractionDigits = 3;
    } else if (number < 0.05) {
      fractionDigits = 2;
    } else {
      fractionDigits = 1;
    }
    let floatFormatter = new Intl.NumberFormat('us', // forcing US to avoid mixed styles on translated pages
      {
        style: 'decimal',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
      });
    return floatFormatter.format(number);
  }
  );
  function addSeperator(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  // Format dates within templates.
  eleventyConfig.addFilter('formatDate', function (datestring) {
    const locales = 'en-US';
    const timeZone = 'America/Los_Angeles';
    if (datestring && datestring.indexOf('Z') > -1) {
      const date = new Date(datestring);
      return `${date.toLocaleDateString(locales, { timeZone, day: 'numeric', month: 'long', year: 'numeric' })} at ${date.toLocaleTimeString(locales, { timeZone, hour: 'numeric', minute: 'numeric' })}`;
    } else if (datestring === 'today') {
      const date = new Date();
      return `${date.toLocaleDateString(locales, { timeZone, day: 'numeric', month: 'long', year: 'numeric' })} at ${date.toLocaleTimeString(locales, { timeZone, hour: 'numeric', minute: 'numeric' })}`;
    } else {
      return datestring;
    }
  });

  eleventyConfig.addFilter('formatDate2', function (datestring, withTime, tags, addDays) {
    return formatDate(datestring, withTime, tags, addDays);
  });

  const formatDate = (datestring, withTime, tags, addDays) => {
    const locales = 'en-US';
    const timeZone = 'America/Los_Angeles';

    if (datestring) {
      let targetdate =
        (typeof datestring === 'object') //date without quotes
          ? datestring
          : datestring === 'today'
            ? new Date()
            : datestring.indexOf('Z') > -1
              ? new Date(datestring)
              : new Date(`${datestring} PST`); // WILL ALWAYS BREAK - not valid javascript. your choices are Z (GMT) or '' (unreliable local time)
      if (targetdate) {
        if (addDays) {
          targetdate.setUTCDate(targetdate.getUTCDate() + addDays);
        }

        const langId = getLangRecord(tags).id;
        const formatRecord = dateFormats[langId.toLowerCase()];

        const defaultTimeString = targetdate.toLocaleTimeString(locales, { timeZone, hour: 'numeric', minute: '2-digit' })
        const dateHours = Number(defaultTimeString.split(' ')[0].split(':')[0]);
        const dateMinutes = defaultTimeString.split(' ')[0].split(':')[1];
        const dateAm = defaultTimeString.split(' ')[1] === 'AM';
        const dateYear = Number(targetdate.toLocaleDateString(locales, { timeZone, year: 'numeric' }));
        const dateDay = Number(targetdate.toLocaleDateString(locales, { timeZone, day: 'numeric' }));
        const dateMonth = Number(targetdate.toLocaleDateString(locales, { timeZone, month: 'numeric' })) - 1;

        const dateformatstring = formatRecord
          .monthdayyear[dateMonth]
          .replace('[day]', dateDay)
          .replace('[year]', dateYear);

        const timeformatstring =
          (dateAm
            ? formatRecord.timeam
            : formatRecord.timepm
          )
            .replace('[hour-12]', dateHours)
            .replace('[hour-24]', (dateHours + (dateAm ? 0 : 12)))
            .replace('[min]', dateMinutes);

        if (withTime) {
          return formatRecord.joinstring
            .replace('[date]', dateformatstring)
            .replace('[time]', timeformatstring);
        } else {
          return dateformatstring;
        }
      }
    }
    return datestring;
  }  

  eleventyConfig.addFilter("dateDeltaHours", function(dmy, dateStringA, dateStringB) { 
    const aDate = new Date(dateStringA);
    const bDate = new Date(dateStringB);
    const diffTime = Math.abs(aDate - bDate);
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours;
  });

  eleventyConfig.addFilter("latestDate", function(dmy, dateStringA, dateStringB) { 
    const aDate = new Date(dateStringA);
    const bDate = new Date(dateStringB);
    return aDate > bDate? dateStringA : dateStringB;
  });

  eleventyConfig.addFilter('formatDateParts', function (datestring, adddays) {
    return formatDate(datestring, null, null, adddays);
  })

  eleventyConfig.addFilter('formatDatePartsPlus1', function (datestring) {
    return formatDate(datestring, null, null, 1);
  })



  eleventyConfig.addFilter('truncate220', function (textstring) {
    if (!textstring || textstring.length < 221) {
      return textstring.slice(0, 220) + '...';
    }
    return textstring;
  });

  const contentfrompage = (content, page, slug) => {
    if (page.fileSlug && slug && page.fileSlug.toLocaleLowerCase().startsWith(slug.toLocaleLowerCase())) {
      return content;
    }
    return "";
  }

  const contentfrompageincludes = (content, page, slug) => {
    if (page.fileSlug && slug && page.fileSlug.toLocaleLowerCase().includes(slug.toLocaleLowerCase())) {
      return content;
    }
    return "";
  }

  const getTranslatedValue = (pageObj, tags, field) => {

    let langTag = getLangRecord(tags);

    if (!pageObj)
      return "";

    if (pageObj[langTag.wptag] && pageObj[langTag.wptag][field]) {
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
  eleventyConfig.addPairedShortcode("pagesectionincludes", contentfrompageincludes);

  let processedPostMap = new Map();
  htmlmap.forEach(pair => {
    processedPostMap.set(pair[0], pair[1])
  })




  const findaccordions = async function (html) {
      const classsearchexp = /<(?<tag>\w+)\s+[^>]*(?<class>wp-accordion(?:-content)?)[^"]*"[^>]*>/gm;
      const getAccordionStartTags = searchArea => [...searchArea.matchAll(classsearchexp)]
        .map(r => ({
          tag: r.groups.tag,
          class: r.groups.class,
          index: r.index,
          fulltag: r[0]
        }));


      const getNextTag = (searchArea, tag) =>
        [...searchArea.matchAll(new RegExp('<(?<closeslash>/?)' + tag + '\\b[^>]*>', 'gm'))]
          .map(r => ({
            index: r.index,
            isCloseTag: r.groups.closeslash.length > 0,
            fulltag: r[0]
          }))[0];


      const getEndTag = (tag, html, startIndex) => {
        let resultIndex = startIndex;
        let startTagsActive = 0;
        let loopsafe = 100;
        let searchArea = html.substring(startIndex);

        while (--loopsafe > 0) {
          const nextTag = getNextTag(searchArea, tag);
          if (!nextTag) throw `Can't find matching end tag - ${tag}`;
          const resultOffset = nextTag.index + nextTag.fulltag.length;
          resultIndex += resultOffset;
          if (nextTag.isCloseTag) {
            if (startTagsActive === 0) {
              nextTag.index = resultIndex;
              return nextTag;
            } else {
              startTagsActive--;
            }
          } else {
            //new open tag
            startTagsActive++;
          }
          searchArea = searchArea.substring(resultOffset);
        } //while
      } //getEndTag

      //Create a list of all accordion content in order
      const accordionContent = getAccordionStartTags(html)
        .map(nextTag => ({
          nextTag,
          endTag: getEndTag(nextTag.tag, html, nextTag.index + nextTag.fulltag.length)
        }))
        .map(tags => ({
          html: html.substring(tags.nextTag.index, tags.endTag.index),
          header: tags.nextTag.class === 'wp-accordion'
        }));


      let result = html;
      //loop and build content
      for (let resultIndex = 0; resultIndex < accordionContent.length; resultIndex++) {
        const row = accordionContent[resultIndex];
        if (row.header) {
          const headerHTML = row.html
            .replace(/wp-accordion/, '')
            .replace(/ class=""/, '');

          let bodyHTML = '';
          //fill the body
          let bodyIndex = resultIndex + 1;
          while (bodyIndex < accordionContent.length && !accordionContent[bodyIndex].header) {
            const bodyRowHTML = accordionContent[bodyIndex].html;
            bodyHTML += bodyRowHTML
              .replace(/wp-accordion-content/, '')
              .replace(/ class=""/, '')
              + '\n';

            bodyIndex++;

            //remove this content tag from html
            result = result.replace(bodyRowHTML, '');
          } //while

          const finalHTML =
            `<cagov-accordion>
              <div class="card">
                <button class="card-header accordion-alpha" type="button" aria-expanded="false">
                  <div class="accordion-title">
            ${headerHTML}
                  </div><div class="plus-munus"><cagov-plus></cagov-plus><cagov-minus></cagov-minus></div>
                </button>
                <div class="card-container" aria-hidden="true">
                  <div class="card-body">
            ${bodyHTML}
                  </div>
                </div>
              </div>
            </cagov-accordion>
            `;

          //replace the header with the new merged content
          result = result.replace(row.html, finalHTML);
        } //if(row.header)
      } //for

      return result;
    }


  //Dark ACCORDIONS
  const finddarkaccordions = async function (html) {
      const classsearchexp = /<(?<tag>\w+)\s+[^>]*(?<class>dark-accordion(?:-content)?)[^"]*"[^>]*>/gm;
      const getAccordionDarkStartTags = searchArea => [...searchArea.matchAll(classsearchexp)]
        .map(r => ({
          tag: r.groups.tag,
          class: r.groups.class,
          index: r.index,
          fulltag: r[0]
        }));


      const getNextTagDark = (searchArea, tag) =>
        [...searchArea.matchAll(new RegExp('<(?<closeslash>/?)' + tag + '\\b[^>]*>', 'gm'))]
          .map(r => ({
            index: r.index,
            isCloseTag: r.groups.closeslash.length > 0,
            fulltag: r[0]
          }))[0];


      const getEndTagDark = (tag, html, startIndex) => {
        let resultIndex = startIndex;
        let startTagsActive = 0;
        let loopsafe = 100;
        let searchArea = html.substring(startIndex);

        while (--loopsafe > 0) {
          const nextTag = getNextTagDark(searchArea, tag);
          if (!nextTag) throw `Can't find matching end tag - ${tag}`;
          const resultOffset = nextTag.index + nextTag.fulltag.length;
          resultIndex += resultOffset;
          if (nextTag.isCloseTag) {
            if (startTagsActive === 0) {
              nextTag.index = resultIndex;
              return nextTag;
            } else {
              startTagsActive--;
            }
          } else {
            //new open tag
            startTagsActive++;
          }
          searchArea = searchArea.substring(resultOffset);
        } //while
      } //getEndTag

      //Create a list of all accordion content in order
      const accordiondarkContent = getAccordionDarkStartTags(html)
        .map(nextTag => ({
          nextTag,
          endTag: getEndTagDark(nextTag.tag, html, nextTag.index + nextTag.fulltag.length)
        }))
        .map(tags => ({
          html: html.substring(tags.nextTag.index, tags.endTag.index),
          header: tags.nextTag.class === 'dark-accordion'
        }));


      let result = html;
      //loop and build content
      for (let resultIndex = 0; resultIndex < accordiondarkContent.length; resultIndex++) {
        const row = accordiondarkContent[resultIndex];
        if (row.header) {
          const headerdarkHTML = row.html
            .replace(/dark-accordion/, '')
            .replace(/ class=""/, '');

          let bodydarkHTML = '';
          //fill the body
          let bodydarkIndex = resultIndex + 1;
          while (bodydarkIndex < accordiondarkContent.length && !accordiondarkContent[bodydarkIndex].header) {
            const bodydarkRowHTML = accordiondarkContent[bodydarkIndex].html;
            bodydarkHTML += bodydarkRowHTML
              .replace(/dark-accordion-content/, '')
              .replace(/ class=""/, '')
              + '\n';

            bodydarkIndex++;

            //remove this content tag from html
            result = result.replace(bodydarkRowHTML, '');
          } //while

          const finaldarkHTML =
            `<div class="full-bleed bg-darkblue dark-accordion-bg">
            <div class="container">
            <div class="row">
            <div class="col-lg-10 mx-auto">
            <cagov-accordion class="dark-accordion">
              <div class="card">
                <button class="card-header accordion-alpha" type="button" aria-expanded="false">
                  <div class="accordion-title">
            ${headerdarkHTML}
                  </div><div class="plus-munus"><cagov-plus></cagov-plus><cagov-minus></cagov-minus></div>
                </button>
                <div class="card-container" aria-hidden="true">
                  <div class="card-body">
            ${bodydarkHTML}
                  </div>
                </div>
              </div>
            </cagov-dark-accordion>
            </div>
            </div>
            </div>
            </div>
            `;

          //replace the header with the new merged content
          result = result.replace(row.html, finaldarkHTML);
        } //if(row.header)
      } //for

      return result;
    }




    const findlinkstolocalize = async function (html) {

      const htmllang = html.match(/<html lang="(?<lang>[^"]*)"/).groups.lang;
      const lang = langData.languages.filter(x => x.enabled && x.hreflang === htmllang).concat(langData.languages[0])[0].id;

      //Scan the DOM for a files.covid19.ca.gov links
      const domTargets = Array.from(html.matchAll(/"(?<URL>https:\/\/(files|static)\.covid19\.ca\.gov\/[^"]*)"/gm))
        .map(r => r.groups.URL);

      if (filesSiteData.length === 0) {
        //init filesitedata in this thread before it is used
        filesSiteData = Array.from(fs.readFileSync('pages/_buildoutput/fileSitemap.xml', 'utf8')
          .matchAll(/<loc>\s*(?<URL>.+)\s*<\/loc>/g)).map(r => r.groups.URL);
      }


      for (const domTarget of domTargets) {
        if (filesSiteData.indexOf(domTarget) === -1) {
          // console.log(`Broken File Link - \n - ${outputPath} \n - ${domTarget}`);
        }
      }
      if (lang !== "en") {
        for (const englishUrl of domTargets) {
          if (englishUrl.includes(localizeString)) {
            //attempt to translate
            let localizedUrl = englishUrl.replace(localizeString, `--${lang.toLowerCase()}.`);

            if (filesSiteData.indexOf(localizedUrl) > -1) {
              html = html.replace(new RegExp(englishUrl, 'gm'), localizedUrl);
            } else {
              //console.log('No translation found - ' + localizedUrl);
            }
          }
        }
      }

      return html;
    }

  eleventyConfig.addTransform("customTransforms", async function (html, outputPath) {
    //outputPath === false means serverless templates
    if ((!outputPath || outputPath.endsWith(".html"))) {
      if (html.indexOf('wp-accordion') > -1) {
        html = await findaccordions(html);
      }
      if (html.indexOf('dark-accordion') > -1) {
        html = await finddarkaccordions(html);
      }
      if (html.indexOf(localizeString) > -1) {
        html = await findlinkstolocalize(html);
      }
    }

    return html;
  });

  eleventyConfig.addFilter('jsonparse', json => JSON.parse(json));
  eleventyConfig.addFilter('includes', (items, value) => (items || []).includes(value));

  const getLangRecord = tags =>
    langData.languages.filter(x => x.enabled && (tags || []).includes(x.wptag)).concat(langData.languages[0])[0];
  const getLangCode = tags =>
    getLangRecord(tags).hreflang;
  const getLangId = tags =>
    getLangRecord(tags).id;
  const getLangIncludeFolder = tags =>
    (getLangRecord(tags).id === 'en') ? '../wordpress-posts/' : '../translated-posts/';

  eleventyConfig.addFilter('lang', getLangCode);
  eleventyConfig.addFilter('langRecord', getLangRecord);
  eleventyConfig.addFilter('langId', getLangId);
  eleventyConfig.addFilter('langIncludeFolder', getLangIncludeFolder);
  eleventyConfig.addFilter('engSlug', engSlug);
  eleventyConfig.addFilter('langFilePostfix', tags => getLangRecord(tags).filepostfix || "");
  eleventyConfig.addFilter('toTranslatedPath', (path, tags) => "/" + (getLangRecord(tags).pathpostfix || "") + path);
  eleventyConfig.addFilter('htmllangattributes', tags => {
    const langRecord = getLangRecord(tags);
    return `lang="${langRecord.hreflang}" xml:lang="${langRecord.hreflang}"${(langRecord.rtl ? ` dir="rtl"` : "")}`;
  });
  eleventyConfig.addFilter('npiSurveyUrl', tags => {
    const langRecord = getLangRecord(tags);
    return langRecord['npi-survey'];
  });
  eleventyConfig.addFilter('pulseSurveyUrl', tags => {
    const langRecord = getLangRecord(tags);
    return langRecord['pulse-survey'];
  });
  eleventyConfig.addFilter('feedbackSurveyUrl', (tags, field) => {
    const langRecord = getLangRecord(tags);
    return langRecord[field];
  });

  eleventyConfig.addFilter('publishdateorfiledate', page => {
    let out = (page.data
      ? page.data.publishdate
      : page.publishdate)
      || page.date.toISOString();

    if (out === 'today')
      out = new Date().toISOString();

    return out;
  }
  );

  eleventyConfig.addPairedShortcode("dothisifcontentexists", (content, contentcontent, match) =>
    contentcontent.match(match) ? content : "");

  // return alternate language pages
  eleventyConfig.addFilter('getAltPageRows', page => {
    if (!page.url) {
      //skip "guidancefeed", etc. or pages with no output (permalink: false)
      return [];
    }

    const slug = engSlug(page);

    return langData.languages
      .filter(x => x.enabled)
      .map(x => ({
        url: `/${x.pathpostfix}${slug}/`.replace(/\/\/$/, '/'),
        langcode: x.id,
        langname: x.name
      }))
      .filter(x => x.url !== page.url)
      ;
  });

  // Ignores the .gitignore file, so 11ty will trigger rebuilds on ignored, built css/js.
  eleventyConfig.setUseGitIgnore(false);

  return {
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "11ty.js"],
    dir: {
      input: "pages",
      output: "docs",
    }
  };
};
