const languages = require('./langData.json').languages;
const camelCase = (string) => string.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

// Pages with translations.
// The 'slug' is the filename prefix.
// The 'split' denotes whether...
// [1] All language files are in the same directory (false, no split), or
// [2] Language files are split between wordpress- and translated-posts folders (true, files are split).
const files = [
  { slug: 'do-dont', split: false },
  { slug: 'footer-data', split: false },
  { slug: 'homepage-text', split: true },
  { slug: 'people-want-to-know', split: true },
  { slug: 'reopening-matrix-data', split: true },
  { slug: 'reopening-roadmap-activity-data', split: true },
  { slug: 'was-this-page-helpful', split: true }
];

// Roll up all data files for all languages.
const data = languages.reduce((katamari, language) => {
  // Fetch all data files for this particular language.
  katamari[language.id] = files.reduce((tumbleweed, file) => {
    const nonEnglishDir = (file.split) ? 'translated-posts' : 'wordpress-posts';
    const parentDir = (language.id === 'en') ? 'wordpress-posts' : nonEnglishDir;
    tumbleweed[camelCase(file.slug)] = require(`../${parentDir}/${file.slug}${language.filepostfix}.json`);
    return tumbleweed;
  }, {});
  return katamari;
}, {});

module.exports = data;
