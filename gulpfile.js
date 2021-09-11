const fs = require('fs');
const gulp = require('gulp');
const rename = require('gulp-rename');
// const sass = require('gulp-sass');
var sass = require('gulp-sass')(require('node-sass'));
const postcss = require('gulp-postcss');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');
const spawn = require('cross-spawn');
const log = require('fancy-log');
const del = require('del');
const browsersync = require('browser-sync').create();
const request = require('request');

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

// Trigger a Browsersync refresh.
const reload = (done) => {
  browsersync.reload();
  done();
};

// Empty out the deployment folder.
const clean = () => del([
  'docs'
]);

// Build the site with Eleventy, then refresh browsersync if available.
const eleventy = (done) => {
  if (process.env.NODE_ENV === 'development') {
    log('Note: Building site in dev mode. Try *npm run start* if you need a full build.');
  }

  // Download the files sitemap for 11ty to use
  download('https://files.covid19.ca.gov/sitemap.xml', './pages/_buildoutput/fileSitemap.xml', error => {
    if (error) {
      console.error(error);
    }
  });

  spawn('npx', ['@11ty/eleventy', '--quiet'], {
    stdio: 'inherit'
  })
  .on('close', code => {
    if(code) {
      throw new Error('Eleventy Build Failed - Exit Code '+code);
    }
    reload(done);
  });
};

// Build the site's javascript via Rollup.
const rollup = (done) => {
  if (process.env.NODE_ENV === 'development') {
    log('Note: Building JS in dev mode. es5.js will not be included. Try *npm run start* if you need it for IE.');
  }
  spawn('npx', ['rollup', '--config', 'src/js/rollup.config.all.js'], {
    stdio: 'inherit'
  }).on('close', code => {
    if(code) {
      throw new Error('Rollup Build Failed - Exit Code '+code);
    }
    done();
  });
};

const includesOutputFolder = 'pages/_buildoutput';
const buildOutputFolder = 'docs/css/build';
const tempOutputFolder = 'temp';

// Process scss files, dump output to temp/development.css.
const scss = (done) => {
  // Because all our scss filenames begin with underscores, they are technically partials.
  // This makes gulp-sass angry.
  // We'll happy hack around this by importing _index.scss into a temp file: shim.scss.
  if (!fs.existsSync(`./${tempOutputFolder}`)) {
    fs.mkdirSync(`./${tempOutputFolder}`);
  }
  fs.writeFileSync(`./${tempOutputFolder}/shim.scss`, "@import './index'");

  return gulp.src(`${tempOutputFolder}/shim.scss`)
    .pipe(sass({
      includePaths: [
        'src/css'
      ]
    }).on('error', sass.logError))
    .pipe(rename('development.css'))
    .pipe(gulp.dest(tempOutputFolder))
    .on('end', () => {
      log('Sass files compiled.');
      done();
    });
};

// Move scss output files into live usage, no further processing.
const devCSS = (done) => gulp.src(`${tempOutputFolder}/development.css`)
  .pipe(gulp.dest(buildOutputFolder))
  .pipe(gulp.dest(includesOutputFolder))
  .on('end', () => {
    log('Generated: development.css.');
    done();
  });

const purgecssExtractors = [
  {
    extractor: content => content.match(/[A-Za-z0-9-_:\/]+/g) || [],
    extensions: ['js']
  }
];

// Purge and minify scss output for use on the homepage.
const homeCSS = (done) => gulp.src(`${tempOutputFolder}/development.css`)
  .pipe(postcss([
    purgecss({
      content: [
        'pages/_includes/main.njk',
        'pages/_includes/header.njk',
        'pages/_includes/footer.njk',
        'pages/_includes/branding.njk',
        'pages/_includes/dropdown-menu.njk',
        'pages/_includes/statewide-header.njk',
        'pages/_includes/accordion.html',
        'pages/**/*.js',
        'pages/wordpress-posts/banner*.html',
        'pages/wordpress-posts/homepage-featured.html',
        'pages/@(translated|wordpress)-posts/@(new|find-services|cali-working|home-header)*.html'
      ],
      extractors: purgecssExtractors,
      whitelistPatternsChildren: [/lang$/, /dir$/]
    }),
    cssnano
  ]))
  .pipe(rename('home.css'))
  .pipe(gulp.dest(buildOutputFolder))
  .pipe(gulp.dest(includesOutputFolder))
  .on('end', () => {
    log('Generated: home.css.');
    done();
  });

// Purge and minify scss output for use across the whole site.
const builtCSS = (done) => gulp.src(`${tempOutputFolder}/development.css`)
  .pipe(postcss([
    purgecss({
      content: [
        'pages/**/*.njk',
        'pages/**/*.html',
        'pages/**/*.js',
        'pages/wordpress-posts/banner*.html',
        'pages/@(translated|wordpress)-posts/new*.html'
      ],
      extractors: purgecssExtractors,
      whitelistPatternsChildren: [/lang$/, /dir$/]
    }),
    cssnano
  ]))
  .pipe(rename('built.css'))
  .pipe(gulp.dest(buildOutputFolder))
  .pipe(gulp.dest(includesOutputFolder))
  .on('end', () => {
    log('Generated: built.css.');
    done();
  });

// Clear out the temp folder.
const emptyTemp = () => del(tempOutputFolder);

// Switch CSS outputs based on environment variable.
const cssByEnv = (process.env.NODE_ENV === 'development') ? gulp.series(devCSS, reload) : gulp.parallel(builtCSS, homeCSS);

const jsCopy = (done) => gulp.src(`${includesOutputFolder}/*.js`)
  .pipe(gulp.dest(buildOutputFolder))
  .on('end', () => {
    log('Copied: js files.');
    done();
  });

// Execute the full CSS build process.
const css = gulp.series(scss, cssByEnv, emptyTemp);

// Build JS, CSS, then the site, in that order.
const build = gulp.series(rollup, css, eleventy, jsCopy);

// copy the js into browsable location for use by WordPress preview

// Watch files for changes, trigger rebuilds.
const watcher = () => {
  const cssWatchFiles = [
    './src/css/**/*'
  ];
  const eleventyWatchFiles = [
    './pages/**/*',
    './.eleventy.js',
    '!./pages/translations/**/*',
    '!./pages/_buildoutput/**/*'
  ];
  const jsWatchFiles = [
    './src/js/**/*'
  ];

  // Watch for CSS and Eleventy files based on environment.
  if (process.env.NODE_ENV === 'development') {
    // In dev, we watch, build, and refresh CSS, JS, and Eleventy separately. Much faster.
    gulp.watch(cssWatchFiles, gulp.series(css));
    gulp.watch(eleventyWatchFiles, gulp.series(eleventy));
    gulp.watch(jsWatchFiles, gulp.series(rollup, reload));
  } else {
    // In prod, we must watch/rebuild CSS and Eleventy together.
    // This covers both re-purging CSS (due to template changes) and CSS embed into templates.
    gulp.watch([...cssWatchFiles, ...eleventyWatchFiles], gulp.series(css, eleventy));
    // Same for JS.
    gulp.watch([...jsWatchFiles, ...eleventyWatchFiles], gulp.series(rollup, eleventy));
  }

  // Watch for changes to static asset files.
  gulp.watch([
    './src/img/**/*'
  ], eleventy);
};

// Build the site, then fire up the watcher and browsersync.
const watch = gulp.series(build, gulp.parallel(watcher, server));

// Nukes the deployment directory prior to build. Totally clean.
const deploy = gulp.series(clean, build);

// function to download a remove file and place it in a location
const download = (url, dest, cb) => {
  if(fs.existsSync(dest)) return; //skipping downloading of existing files

  console.log(`downloading ${url}`);
  const file = fs.createWriteStream(dest);
  const sendReq = request.get(url);

  // verify response code
  sendReq.on('response', response => {
    if (response.statusCode !== 200) {
      return cb(response.statusCode);
    }

    sendReq.pipe(file);
  });

  // close() is async, call cb after close completes
  file.on('finish', () => file.close(cb));

  // check for request errors
  sendReq.on('error', err => {
    fs.unlink(dest);
    return cb(err.message);
  });

  file.on('error', err => { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    return cb(err.message);
  });
};

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
