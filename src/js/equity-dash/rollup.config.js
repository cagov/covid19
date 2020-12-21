import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const defaultConfig = {
  equityChartsDataLoc: 'https://files.covid19.ca.gov/data/reviewed/'
}
const stagingConfig =  {
  equityChartsDataLoc: 'https://files.covid19.ca.gov/data/to-review/'
}

const devOutputPath = 'docs/js/equitydash.js';
const prodOutputPath = 'pages/_buildoutput/equitydash.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;
const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") ? stagingConfig : defaultConfig;

export default {
  input: 'src/js/equity-dash/index.js',
  output: {
    intro: 'const config = '+JSON.stringify(jsConfig),
    file: outputPath,
    format: 'esm'
  },
  plugins: [
    resolve(), 
    postcss({
      extract: false,
      modules: false,
      use: ['sass'],
    }),
    // terser(),
    json()]
};
