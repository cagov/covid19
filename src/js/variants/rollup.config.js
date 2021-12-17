import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';


const defaultConfig = {
  chartsStateDashTablesLoc: 'https://data.covid19.ca.gov/data/dashboard/',
  chartsVariantsLoc: 'https://data.covid19.ca.gov/data/variants/',
}
const stagingConfig =  {
  chartsStateDashTablesLoc: 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboardTables_Staging/data/dashboard/',
  chartsVariantsLoc: 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboardVariants_Staging/data/variants/',
}

const devOutputPath = 'docs/js/variants.js';
const prodOutputPath = 'pages/_buildoutput/variants.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;
const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === "development") ? stagingConfig : defaultConfig;

export default {
  input: 'src/js/variants/index.js',
  output: {
    intro: 'const config = '+JSON.stringify(jsConfig),
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), 
            postcss({
              extract: false,
              modules: false,
              use: ['sass'],
            }),
            terser(),
            json()
          ]
};


