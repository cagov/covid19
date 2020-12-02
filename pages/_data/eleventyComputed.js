const langData = require('./langData.json');

//The lang record is assumed from tags or filepostfix
const getLangRecordFromData = data =>
  langData.languages.filter(x=>
    x.enabled
    && 
      (
        (data.tags || []).includes(x.wptag)
      ||
        x.filepostfix&&data.page.fileSlug.endsWith(x.filepostfix)
      )
    )
    .concat(langData.languages[0])[0];

module.exports = {
  //This allows for pages to just refer to "language" as an object in all pages
  language: data => getLangRecordFromData(data)
};
