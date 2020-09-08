const languages = require('./langData.json').languages;
const camelCase = string => string.replace(/-([a-z])/g, g => g[1].toUpperCase());

// Pages with translations.
// The 'slug' is the filename prefix.
// The 'split' denotes whether...
// [1] All language files are in the same directory (false, no split), or
// [2] Language files are split between wordpress- and translated-posts folders (true, files are split).
const files = [
  { slug: 'do-dont', split: false },
  { slug: 'footer-data', split: false },
  { slug: 'homepage-text', split: true },
  { slug: 'people-want-to-know', split: true, tableSchema: {
    Table1: {
      require: ['text','_url']
    }
  }},
  { slug: 'reopening-matrix-data', split: true, tableSchema: {
    Table1: {
      require: ['colorLabel','_Color label','New cases','Positive tests','description','County tier']
    },
    Table3: {
      pivot: ['_id','text'],
      require: ['_id','text',
        'Header – county risk level',
        'Header – new cases',
        'Header – positive tests',
        'Description – new cases',
        'Description – positive cases'
    ]}
  }},
  { slug: 'reopening-roadmap-activity-data', split: true },
  { slug: 'was-this-page-helpful', split: true }
];

// Reusable function for validating JSON
const JSONValidator = (dataset,schema) => {
  // Sample Schema
  //  Table1: { require: ['_id','text'], pivot: ['_id','text'] }}
  
  for(const tablename of Object.keys(schema)) {
    const table = dataset[tablename];
    if(!table) return `${tablename} is missing.`;

    const tableschema = schema[tablename];
    if(tableschema.pivot) {
      const idprop = tableschema.pivot[0];
      const valueprop = tableschema.pivot[1];
      table.forEach(r=>{table[r[idprop]]=r[valueprop]});
    }

    for(const colname of tableschema.require || [] )
      if(!table[colname] && table.some(x=>!x[colname])) return `${tablename} is missing at least one required '${colname}'.`;
  }
}

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

    if(file.tableSchema) {
      var errorMessage = JSONValidator(tableData,file.tableSchema);
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
