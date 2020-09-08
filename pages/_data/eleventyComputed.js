const langData = require('./langData.json');

const getLangRecord = (tags) =>
  langData.languages.filter(x=>x.enabled&&(tags || []).includes(x.wptag)).concat(langData.languages[0])[0];

module.exports = {
  language: data => getLangRecord(data.tags)
};
