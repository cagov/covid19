const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');
const spawn = require('cross-spawn');
const log = require('fancy-log');
const del = require('del');
const browsersync = require('browser-sync').create();

// Initialize BrowserSync.
const server = (done) => {
  browsersync.init({
    server: 'docs',
    watch: false,
    ghostMode: false,
    logFileChanges: true,
    logLevel: 'info',
    open: false,
    port: 8000,
    ui: {
      port: 8001
    }
  });
  done();
};

// Empty out the deployment folder.
const clean = () => del([
  'docs'
]);

// Build the site with Eleventy, then refresh browsersync if available.
const eleventy = (done) => {
  spawn('npx', ['@11ty/eleventy', '--quiet'], {
    stdio: 'inherit'
  }).on('close', () => {
    browsersync.reload();
    done();
  });
};

// Build the site's javascript via Rollup.
const rollup = (done) => {
  spawn('npx', ['rollup', '--config', 'src/js/rollup.config.all.js'], {
    stdio: 'inherit'
  }).on('close', () => {
    done();
  });
};

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
    'pages/_includes/footer.njk',
    'pages/**/*.js'
  ]
});

const includesOutputFolder = 'pages/_includes';
const buildOutputFolder = 'docs/css/build';

/*
// Uncomment as needed to test specific CSS builds.
// This may replace the current css function, more to come.

const scss = (done) => gulp.src('src/css/index.scss')
  .pipe(sass({
    includePaths: 'src/css'
  }).on('error', sass.logError))
  .pipe(rename('development.css'))
  .pipe(gulp.dest('temp'))
  .on('end', () => {
    log('Sass files compiled.');
    done();
  });

const devCSS = (done) => gulp.src('temp/development.css')
  .pipe(gulp.dest(buildOutputFolder))
  .pipe(gulp.dest(includesOutputFolder))
  .on('end', () => {
    log('Generated: development.css.');
    done();
  });

const homeCSS = (done) => gulp.src('temp/development.css')
  .pipe(postcss([purgeCssForHome, cssnano]))
  .pipe(rename('home.css'))
  .pipe(gulp.dest(buildOutputFolder))
  .pipe(gulp.dest(includesOutputFolder))
  .on('end', () => {
    log('Generated: home.css.');
    done();
  });

const builtCSS = (done) => gulp.src('temp/development.css')
  .pipe(postcss([purgeCssForAll, cssnano]))
  .pipe(rename('built.css'))
  .pipe(gulp.dest(buildOutputFolder))
  .pipe(gulp.dest(includesOutputFolder))
  .on('end', () => {
    log('Generated: built.css.');
    done();
  });

// Clear out the temp folder.
const removeTemp = () => del([
  'temp'
]);

const cssByEnv = (process.env.NODE_ENV === 'development') ? devCSS : gulp.parallel(builtCSS, homeCSS);

const css = gulp.series(scss, cssByEnv, removeTemp);
*/

// Build the site's CSS.
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
        log('Generated: development.css.');
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
        log('Generated: built.css, home.css.');
        done();
      });
  }

  return stream;
};

// Build JS, CSS, then the site, in that order.
const build = gulp.series(rollup, css, eleventy);

// Watch files for changes, trigger rebuilds.
const watcher = () => {
  // Watch the following files for CSS-related changes.
  gulp.watch([
    // CSS files, of course.
    './src/css/**/*',
    // Templates too, in case we need a re-purge.
    './pages/**/*',
    // Do not watch translations because it was in .eleventyignore.
    '!./pages/translations/**/*',
    // Do not watch CSS and JS _includes. We will trigger those rebuilds manually.
    '!./pages/_includes/*.(css|js)',
    // Do not watch htmlmap.json because it was in .gitignore.
    '!./pages/_data/htmlmap.json'
  ], gulp.series(css, eleventy));

  // Watch for changes to JS files.
  gulp.watch([
    './src/js/**/*'
  ], gulp.series(rollup, eleventy));

  // Watch for changes to static asset files.
  gulp.watch([
    './src/img/**/*'
  ], eleventy);
};

// Build the site before firing up the watcher, browsersync.
const watch = gulp.series(build, gulp.parallel(watcher, server));

// Nukes the deployment directory prior to build. Totally clean.
const deploy = gulp.series(clean, build);

module.exports = {
  eleventy,
  rollup,
  css,
  build,
  clean,
  watch,
  deploy,
  default: watch
};
