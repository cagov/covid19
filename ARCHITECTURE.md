# covid19.ca.gov Application Architecture

This application is an instance of 11ty.

Eleventy is a static-site generator which
* pulls data from a Wordpress content API
* performs some processing steps
* generates static HTML pages which are then pushed to a repository on Github.

This document
* describes how our configuration works
* provides an overview of the application.

## Running the application as a developer
`npm run dev` — Run a local version of the application.
`npm run start` — Create a static build of the site and then run `watch` mode. BrowserSync will check for file changes and then update the application.

## Overview of npm scripts
Some notes on the package.json.
Note: We could consider supporting .jsonc (JSON with comments) and move these comments to package.json, but that requires some special engineering support, that could be difficult to replicate across packages.


`dev`
: Run a local version of the application in watch mode. Sets NODE_ENV to development, which enables some features for development mode only.

`start`
: Creates a local build, runs BrowserSync and does not use NODE_ENV development, but will use your machine's NODE_ENV, which should be set to `production`.

`serve`
`npx @11ty/eleventy --serve --quiet`
: Create a local http server 11ty build locally. (Q: Where this is used?)

`build`
: Run gulp build script, which builds JS, CSS, then the site, in that order.

`build:css`
: Executes the full CSS build process. Aggregates all sass partials from `src/css`. For home page css, a list of nunjucks templates is read and the run through postcss-purgecss. PurgeCSS `analyzes your content and your css files. Then it matches the selectors used in your files with the one in your content files. It removes unused selectors from your css, resulting in smaller css files.`
: If in development mode, writes this to development.css & reloads on changes.

`build:site`
: Runs eleventy gulp process. This pulls the sitemap for all of the files, which are mostly pdf files.
: Then eleventy is run, which (??? Not sure exactly).

`build:js`
: Build the site's javascript via Rollup, a package that bundles JavaScript modules.

`build:js:ancient`
`rollup --config src/js/rollup.config.es5.js`
: Outputs old es5 code?

`build:js:esm`
`rollup --config src/js/rollup.config.js`
: ES Modules?

`build:js:alerts`
`rollup --config src/js/alerts/rollup.config.js`
: Used anywhere?

`build:js:plasma`
`rollup --config src/js/plasma/rollup.config.js`
: Used anywhere?

`build:js:survey`
`rollup --config src/js/survey/rollup.config.js`
: Used anywhere?

`build:js:telehealth`
`rollup --config src/js/telehealth/rollup.config.js`
: Used anywhere?

`build:js:whatwhere`
`rollup --config src/js/what-open-where/rollup.config.js`
: Used anywhere?

`build:js:video`
`rollup --config src/js/video/rollup.config.js`
: Used anywhere?

`watch`
: Build the site, then fire up the watcher and browsersync.

`clean`
: Empty out the deployment folder. (`/docs`)

`deploy`
: Nukes the deployment directory prior to build. Totally clean.

`local`
: Runs site in watch mode, with default NODE_ENV settings. Watch mode creates a build and then watches for specific local file changes.

`local:dev`
: Runs site in watch mode, but with NODE_ENV of development. Is like npm start, except with `development` environment variable set.

`compress:img`
`cd src/build && node img.js`
: Changes to the build directory and runs an image optimize script on files. Creates Webp (@TODO confirm that this works). Moves `unoptimized` to folder called `original`
: Where is this called?

## Overview of gulpfile.js
Uses BrowserSync for local development.

## Dependencies
@TODO Add any special notes on package decisions as we learn about them.
`@11ty/eleventy`

`@cagov/accordion`

`@cagov/lookup`

`@cagov/pagerating`

`@cagov/step-list`

`@webcomponents/webcomponentsjs`

`awesomplete-es6`

`css-purge`

`element-closest-polyfill`

`url-search-params-polyfill`

`whatwg-fetch`


## Dev Dependencies
@TODO Add any special notes on package decisions as we learn about them.

`@babel/core`

`@babel/preset-env`

`@fullhuman/postcss-purgecss`

`@rollup/plugin-babel`

`@rollup/plugin-commonjs`

`@rollup/plugin-json`

`@rollup/plugin-node-resolve`

`acorn`

`browser-sync`

`cross-env`

`cross-spawn`

`cssnano`

`del`

`fancy-log`

`gulp`

`gulp-postcss`

`gulp-rename`

`gulp-sass`

`gulp-sourcemaps`

`imagemin`

`imagemin-pngquant`

`imagemin-webp`

`md5`

`node-sass`

`npm-run-all`

`onchange`

`postcss-url`

`rollup`

`rollup-plugin-terser`

## Files
`package.json`
: Packages and script commands. Sets app entry point. Provides information about project. Script commands used by other tools.

`gulpfile.js`
: Build deployment.

`.eleventy.js`
: Configuration file for Eleventy build.

* Reads a set of JSON documents to build and compile.
* Builds datasets.
* Static assets are copied to folders in the build.
* Processes manually overridden content.
* Fixes http paths and moves them to https for all files and content links.
* Reads all WordPress posts based on folder (from API data?), Moves translations to correct paths (@TODO confirm)
* Get covidGuidance collection, with tag guidance feed. Sort by date.
* Set up an error message (@TODO How is this used?)
* Add some functions and filters, such as `.find` and `formatNumber`, date formatters and text truncators.
* Generates accordion data
* Localizes links
* Creates special date filters
* Generates translated menu JSON object.
