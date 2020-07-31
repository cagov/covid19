const imports = require('postcss-import');
const purgecss = require('@fullhuman/postcss-purgecss');
const sass = require('node-sass');

const purgeHomeCss = purgecss({
  content: [
    'pages/_includes/main.njk',
    'pages/_includes/header.njk',
    'pages/_includes/news-feed-home.html',
    'pages/_includes/footer.njk'
  ]
});

const purgeAllCss = purgecss({
  content: [
    'pages/**/*.njk',
    'pages/**/*.html',
    'pages/**/*.js'
  ]
});

module.exports = {
  preprocessor: (content, id) => new Promise((resolve, reject) => {
    const result = sass.renderSync({ file: id });
    resolve({ code: result.css.toString() });
  }),
  plugins: [
    imports,
    purgeHomeCss
  ],
  extract: true,
  extensions: ['.scss', '.css']
};
