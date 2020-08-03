const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');

// Initialize PurgeCSS, comparing against the whole site.
const purgeCssForAll = purgecss({
  content: [
    'pages/**/*.njk',
    'pages/**/*.html',
    'pages/**/*.js'
  ]
});

// Initialize PurgeCSS, comparing against the following files for the homepage.
const purgeCssForHome = purgecss({
  content: [
    'pages/_includes/main.njk',
    'pages/_includes/header.njk',
    'pages/_includes/news-feed-home.html',
    'pages/_includes/footer.njk'
  ]
});

const includesOutputFolder = 'pages/_includes';
const buildOutputFolder = 'docs/css/build';

const css = (done) => {
  // First: we process the Sass files.
  let stream = gulp.src('src/css/index.scss')
    .pipe(sass({
      includePaths: 'src/css'
    }).on('error', sass.logError));

  // If development environment, create one CSS file: development.css.
  // Don't do any CSS purging.
  if (process.env.NODE_ENV === 'development') {
    stream = stream
      .pipe(rename('development.css'))
      .pipe(gulp.dest(buildOutputFolder))
      .pipe(gulp.dest(includesOutputFolder))
      .on('end', () => {
        console.log('Generated: development.css.');
        done();
      });
  // If not development environment, then create two CSS files: home.css and built.css.
  // Assume production; do full purging on both files.
  } else {
    stream = stream
      // Purge, minify, and save 'built.css'.
      .pipe(postcss([purgeCssForAll, cssnano]))
      .pipe(rename('built.css'))
      .pipe(gulp.dest(buildOutputFolder))
      .pipe(gulp.dest(includesOutputFolder))
      // Purge even more for 'home.css'.
      .pipe(postcss([purgeCssForHome, cssnano]))
      .pipe(rename('home.css'))
      .pipe(gulp.dest(buildOutputFolder))
      .pipe(gulp.dest(includesOutputFolder))
      .on('end', () => {
        console.log('Generated: built.css, home.css.');
        done();
      });
  }

  return stream;
};

const watcher = () => gulp.watch('src/css/**/*', css);
const watch = gulp.series(css, watcher);

module.exports = {
  css,
  watch,
  default: watch
};
