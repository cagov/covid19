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

const sassOutputFolder = 'pages/_includes';

// Process and purge sass files.
gulp.task('scss', (done) => gulp.src('src/css/index.scss')
  // First: process the Sass files.
  .pipe(sass({
    includePaths: 'src/css'
  }).on('error', sass.logError))
  // Next: purge, minify, and save as 'built.css'.
  .pipe(postcss([purgeCssForAll, cssnano]))
  .pipe(rename('built.css'))
  .pipe(gulp.dest(sassOutputFolder))
  // Finally: purge even more for 'home.css'.
  .pipe(postcss([purgeCssForHome, cssnano]))
  .pipe(rename('home.css'))
  .pipe(gulp.dest(sassOutputFolder))
  .on('end', done)
);

// Watch sass files for changes, then process and purge.
gulp.task('watch', gulp.series('scss', (done) => {
  gulp.watch('src/css/**/*', gulp.parallel('scss'));
  done();
}));

gulp.task('default', gulp.series('watch'));
