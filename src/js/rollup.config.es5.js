import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';

const defaultConfig = {
  chartsDataFile: 'https://data.covid19.ca.gov/data/infections-by-group/infections-by-group-california.json',
  chartsStateDashTablesLoc: 'https://data.covid19.ca.gov/data/dashboard/',
}
const stagingConfig =  {
  chartsDataFile: 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboard_Summary_Staging/data/infections-by-group/infections-by-group-california.json',
  chartsStateDashTablesLoc: 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboardTables_Staging/data/dashboard/',
}

const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") ? stagingConfig : defaultConfig;

export default {
  input: 'src/js/es5.js',
  output: {
    intro: 'const config = '+JSON.stringify(jsConfig),
    file: 'docs/js/es5.js',
    format: 'cjs'
  },
  moduleContext: {
    // whatwg-fetch angers Rollup due to ancient use of 'this'.
    // This fix is not essential to function. It removes a warning during the build process.
    // https://rollupjs.org/guide/en/#error-this-is-undefined
    [path.resolve('./node_modules/whatwg-fetch/fetch.js')]: 'window'
  },
  plugins: [
    resolve({
      browser: true
    }),
    postcss({
      extract: false,
      modules: false,
      use: ['sass'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: ['node_modules/@babel/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: '> 0.5%'
            }
          }
        ]
      ]
    }),
    json(),
    terser()
  ]
};
