const languages = require('./langData.json').languages;
const camelCase = (string) => string.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

// Pages with translations.
// The 'slug' is the filename prefix.
// The 'split' denotes whether...
// [1] All language files are in the same directory (false, no split), or
// [2] Language files are split between wordpress- and translated-posts folders (true, files are split).
const files = [
  { slug: 'do-dont', split: false },
  { slug: 'common-page-labels', split: true, tableSchema: {
    Table1: {
      pivot: true,
      require: [
        'california_for_all',
        'your_actions_save_lives',
        'search',
        'search_this_site',
        'submit_search',
        'language',
        'select_language',
        'more',
        'menu',
        'what_are_you_looking_for',
        'is_this_page_useful',
        'answer_yes',
        'answer_no',
        'additional_comments',
        'this_field_required',
        'submit',
        'thank_you_for_your_comments',
        'thank_you_for_your_feedback',
        'home'
      ]
    },
    Table2: {
      require: ['Name','_URL']
    },
    Table3: {
      require: ['Name','_slug']
    }
  }},
  { slug: 'people-want-to-know', split: true, tableSchema: {
    Table1: {
      require: ['text','_url']
    }
  }},
  { slug: 'reopening-matrix-data', split: true, tableSchema: {
    Table1: {
      require: ['colorLabel','_Color label','New cases','Positive tests','description','County tier']
    },
    Table2: {
      pivot: true,
      require: [
        'Header – county risk level',
        'Header – new cases',
        'Header – positive tests',
        'Description – new cases',
        'Description – positive cases'
    ]}
  }},
  { slug: 'safer-economy-lang', split: true, tableSchema: {
    Table1: {
      pivot: true,
      require: [
        'title',
        'activityLabel'
    ]}
  }},
  { slug: 'reopening-roadmap-activity-data', split: true },
  { slug: 'menu-links', split: true, tableSchema: {
    Table1: {
      require: ['_section_index','label']
    },
    Table2: {
      require: ['_section_index','label','_slug_or_url']}
    } 
  }
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

// Pivots a table to a single row using the first column as the new row key and the 2nd column as data.
// requires more than 1 row and more than one column to pivot.
const pivotTable = table => {
  if(table.length>1&&Object.keys(table[0]).length>1) {
    const singleRow = {};
    //pull all the rows out to make new columns
    while(table.length){   
      const row = table.shift(); //remove and retrieve the first item off the array
      const keys = Object.keys(row);

      let newName = row[keys[0]];
      while (singleRow[newName]) {
        newName+='_'; //in case of duplicate column name
      }
      singleRow[newName]=row[keys[1]];
    }
    table.push(singleRow);
  }
}

//Reads the tableSchema and applys pivots to tables that want it
const applyPivots = (file,dataset) => {
  if(file.tableSchema) {
    Object.keys(file.tableSchema)
      .filter(tableName => file.tableSchema[tableName].pivot)
      .forEach(tableName => {pivotTable(dataset[tableName]);});
  }
}

//use the first row in each english table to make new keys for the non-english version
const restoreEnglishKeys = (nonEnglishData, englishData) => {
  //All tables by name
  Object.keys(englishData).forEach(tableName => {
    const englishTable = englishData[tableName] || [];
    const nonEnglishTable = nonEnglishData[tableName] || [];
    if(englishTable.length&&nonEnglishTable.length) {
      const nonEnglishColumnNames = Object.keys(nonEnglishTable[0]);

      //Create a map for non-english to english columns
      const columnMaps = [];
      Object.keys(englishTable[0])
        .forEach((english,i) => {
          const nonEnglish = nonEnglishColumnNames[i];
          if(english.startsWith('_') || english !== nonEnglish) {
            columnMaps.push({
              english,
              nonEnglish
            });
          }
        });

      //fix the column keys on every row
      if(columnMaps.length) {
        nonEnglishTable.forEach((row,i) => {
          columnMaps.forEach(cmap => {
            if (cmap.english.startsWith('_')) {
              //This column should never be translated
              //Use the english value if the English table has a matching row.
              const englishRow = englishTable[i];
              if (englishRow) {
                row[cmap.english] = englishRow[cmap.english];
              }
            }

            //default to the translated value
            row[cmap.english] = row[cmap.english] || row[cmap.nonEnglish];

            if (cmap.english !== cmap.nonEnglish) {
              //remove non-english rows.
              delete row[cmap.nonEnglish];
            }
          }); //forEach
        }); //forEach
      } //if
    }
  });
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

    applyPivots(file,tableData);

    if(!isEnglish) {
      const englishData = require(englishPath);
      applyPivots(file, englishData);
      restoreEnglishKeys(tableData, englishData);
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
