const languages = require('./langData.json').languages;
const camelCase = string => string.replace(/-([a-z])/g, g => g[1].toUpperCase());

// Reusable function for checking for the existing keys
const validateColumnExists = (dataset,tablename,...colnames) => {
  const table = dataset[tablename];
  if(!table) return `Table ${tablename} is missing.`;
  for(const colname of colnames)
    if(table.some(x=>!x[colname])) return `${tablename} is missing at least one '${colname}.`;
  return null;
}

const validatePeopleWantToKnow = dataset => 
  validateColumnExists(dataset,'Table1','text','_url') 
  || validateColumnExists(dataset,'Table2','text','_url') 
;

const validateReopeningMatrixData = dataset => 
  validateColumnExists(dataset,'Table1','colorLabel','_Color label','New cases','Positive tests','description','County tier')
  || validateColumnExists(dataset,'Table3','_id','text')
;

// Pages with translations.
// The 'slug' is the filename prefix.
// The 'split' denotes whether...
// [1] All language files are in the same directory (false, no split), or
// [2] Language files are split between wordpress- and translated-posts folders (true, files are split).
const files = [
  { slug: 'do-dont', split: false },
  { slug: 'footer-data', split: false },
  { slug: 'homepage-text', split: true },
  { slug: 'people-want-to-know', split: true, tableValidator: validatePeopleWantToKnow },
  { slug: 'reopening-matrix-data', split: true, tableValidator: validateReopeningMatrixData },
  { slug: 'reopening-roadmap-activity-data', split: true },
  { slug: 'was-this-page-helpful', split: true }
];

/*
  Roll up all data files for all languages.
  Data structure will look like the following. Note Language IDs and camelCased filenames.
  {
    "en": {
      "doDont": { ...file data... },
      "footerData": { ...file data... },
      ...more "en" files...
    },
    "es" { ...all "es" files... },
    ...more languages...
  }
*/
const data = languages.reduce((katamari, language) => {
  // Fetch all data files for this particular language.
  katamari[language.id] = files.reduce((tumbleweed, file) => {
    const nonEnglishDir = (file.split) ? 'translated-posts' : 'wordpress-posts';
    const parentDir = (language.id === 'en') ? 'wordpress-posts' : nonEnglishDir;
    const path = `../${parentDir}/${file.slug}${language.filepostfix}.json`;
    const tableData = require(path);
    if(file.tableValidator) {
      var errorMessage = file.tableValidator(tableData);
      if(errorMessage) {
        throw new Error(`${path}\n${errorMessage}`);
      }
    }
    tumbleweed[camelCase(file.slug)] = tableData;
    return tumbleweed;
  }, {});
  return katamari;
}, {});

module.exports = data;
