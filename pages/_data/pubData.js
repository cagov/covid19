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
      require: [
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
  //  Table1: { require: ['_id','text'] }}
  
  for(const tablename of Object.keys(schema)) {
    const table = dataset[tablename];
    if(!table) return `${tablename} is missing.`;

    const tableschema = schema[tablename];

    for(const colname of tableschema.require || [] )
      if(!table[colname] && table.some(x=>!x[colname])) return `${tablename} is missing at least one required '${colname}'.`;
  }
}

const applyPivots = (slug,dataset) => {
  //console.log(slug);
  //todo: tableize
  if(slug==='reopening-matrix-data') {
    //console.log('pivot...');
    const table = dataset.Table3;
    //console.log(table);

    if(table.length>1) {
      const singleRow = {};
      while(table.length){   
        const row = table.shift(); //remove and retrieve the first item off the array
        const keys = Object.keys(row);

        let newName = row[keys[0]];
        while (singleRow[newName]) {
          newName+='_';
        }

        singleRow[newName]=row[keys[1]];
      }
      table.push(singleRow);
    }


    //console.log(table);
  }

}

const restoreEnglishKeys = (nonEnglishData, englishData, slug) => {


//use the first row in each english table to make new keys for the non-english version
  const tableNames = Object.keys(englishData);
  //console.log(tableNames);
  tableNames.forEach(tableName => {
    const englishTable = englishData[tableName];
    //console.log(tableName);
    const nonEnglishTable = nonEnglishData[tableName];
    if(englishTable&&englishTable.length&&nonEnglishTable&&nonEnglishTable.length) {
      const englishColumnNames = Object.keys(englishTable[0]);
      const nonEnglishColumnNames = Object.keys(nonEnglishTable[0]);
      console.log(slug + '-' + tableName);
      //console.log(englishColumnNames);
      //console.log(nonEnglishColumnNames);

      let columnMap = {};
      englishColumnNames.forEach((name,i) => {
        const nonEnglishName = nonEnglishColumnNames[i];
        if(name!==nonEnglishName) {
          columnMap[nonEnglishName] = name;
        }
      });


console.log(columnMap);
      if(Object.keys(columnMap).length) {
        console.log(columnMap);
        nonEnglishTable.forEach(row => {
          Object.keys(columnMap).forEach(columnName => {
            const columnValue = row[columnName];
            row[columnMap[columnName]]=columnValue;
          });
        });
        console.log(nonEnglishTable);
      }

    }
  })

  //console.log(nonEnglishData);
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
    const isEnglish = language.id === 'en';
    const nonEnglishDir = (file.split) ? 'translated-posts' : 'wordpress-posts';
    const englishPath = `../wordpress-posts/${file.slug}.json`;
    const path = isEnglish ? englishPath : `../${nonEnglishDir}/${file.slug}${language.filepostfix}.json`;
    const tableData = require(path);

    applyPivots(file.slug,tableData);

    if(!isEnglish) {
      const englishData = require(englishPath);
      applyPivots(file.slug, englishData);
      restoreEnglishKeys(tableData, englishData, file.slug);
    }

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
