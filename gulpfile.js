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

const sassy = (done) => {
  let stream = gulp.src('src/css/index.scss')
    // First: we process the Sass files.
    .pipe(sass({
      includePaths: 'src/css'
    }).on('error', sass.logError));

  if (process.env.NODE_ENV === 'development') {
    stream = stream
      .pipe(rename('development.css'))
      .pipe(gulp.dest(buildOutputFolder))
      .pipe(gulp.dest(includesOutputFolder))
      .on('end', () => {
        console.log('Generated: development.css.');
        done();
      });
  } else {
    stream = stream
      // Next: purge, minify, and save as 'built.css'.
      .pipe(postcss([purgeCssForAll, cssnano]))
      .pipe(rename('built.css'))
      .pipe(gulp.dest(buildOutputFolder))
      .pipe(gulp.dest(includesOutputFolder))
      // Finally: purge even more for 'home.css'.
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

const scss = (done) => gulp.src('src/css/index.scss')
  // First: process the Sass files.
  .pipe(sass({
    includePaths: 'src/css'
  }).on('error', sass.logError))
  // Next: purge, minify, and save as 'built.css'.
  .pipe(postcss([purgeCssForAll, cssnano]))
  .pipe(rename('built.css'))
  .pipe(gulp.dest(buildOutputFolder))
  // Finally: purge even more for 'home.css'.
  .pipe(postcss([purgeCssForHome, cssnano]))
  .pipe(rename('home.css'))
  .pipe(gulp.dest(buildOutputFolder))
  .on('end', done);

const builtFilesToMove = [
  `${buildOutputFolder}/home.css`,
  `${buildOutputFolder}/built.css`
];

const move = (done) => gulp.src(builtFilesToMove)
  .pipe(gulp.dest(includesOutputFolder))
  .on('end', done);

const css = gulp.series(scss, move);

const watcher = () => gulp.watch('src/css/**/*', sassy);
const watch = gulp.series(sassy, watcher);

const env = (done) => gulp.src(builtFilesToMove).on('end', () => {
  console.log(process.env.NODE_ENV);
  done();
});

module.exports = {
  sassy,
  css,
  watch,
  default: watch,
  env
};
