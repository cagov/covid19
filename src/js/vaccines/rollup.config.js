import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const defaultConfig = {
  equityChartsSampleDataLoc: 'https://files.covid19.ca.gov/data/chart-sandbox/',
  equityChartsVEDataLoc: 'https://files.covid19.ca.gov/data/vaccine-equity/',
  chartsVHPIDataLoc: 'https://files.covid19.ca.gov/data/vaccine-hpi/',
}

const stagingConfig =  {
  equityChartsSampleDataLoc: 'https://files.covid19.ca.gov/data/chart-sandbox/',
  equityChartsVEDataLoc: 'https://raw.githubusercontent.com/cagov/covid-static/a2a5129fa68344cec6cae1ce09a3c02666707e9b/data/vaccine-equity/',
  chartsVHPIDataLoc: 'https://raw.githubusercontent.com/cagov/covid-static/6d740b3d1a8cc39d7808f045baef6c7566846d5b/data/vaccine-hpi/',
  // https://raw.githubusercontent.com/cagov/covid-static/a2a5129fa68344cec6cae1ce09a3c02666707e9b/data/vaccine-equity/age/vaccines_by_age_alameda.json
  // https://raw.githubusercontent.com/cagov/covid-static/6d740b3d1a8cc39d7808f045baef6c7566846d5b/data/vaccine-hpi/vaccine-hpi.json
}

const devOutputPath = 'docs/js/vaccines.js';
const prodOutputPath = 'pages/_buildoutput/vaccines.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;
const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") ? stagingConfig : defaultConfig;
// console.log("!!!!! NODE_ENV",process.env.NODE_ENV);

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
    // terser(),
    json()]
};
