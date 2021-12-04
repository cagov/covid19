import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const defaultConfig = {
  equityChartsVEDataLoc: 'https://data.covid19.ca.gov/data/vaccine-equity/',
  chartsVHPIDataLocDoses: 'https://data.covid19.ca.gov/data/vaccine-hpi/',
  chartsVHPIDataLocPeople: 'https://data.covid19.ca.gov/data/vaccine-hpi/',
}
const stagingConfig =  {
  equityChartsVEDataLoc: 'https://data.covid19.ca.gov/data/vaccine-equity/',
  chartsVHPIDataLocDoses: 'https://data.covid19.ca.gov/data/vaccine-hpi/',
  chartsVHPIDataLocPeople: 'https://data.covid19.ca.gov/data/vaccine-hpi/',
}

const devOutputPath = 'docs/js/vaccines.js';
const prodOutputPath = 'pages/_buildoutput/vaccines.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;
const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") ? stagingConfig : defaultConfig;

export default {
  input: 'src/js/vaccines/index.js',
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
    terser(),
    json()]
};
