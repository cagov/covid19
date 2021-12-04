import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';


const defaultConfig = {
  chartsDataFile: 'https://data.covid19.ca.gov/data/infections-by-group/infections-by-group-california.json',
  chartsStateDashTablesLoc: 'https://data.covid19.ca.gov/data/dashboard/',
  chartsStateDashTablesLocSparklineVaccines: 'https://data.covid19.ca.gov/data/dashboard/',
  chartsStateDashTablesLocPostvax: 'https://data.covid19.ca.gov/data/dashboard/',
}
const stagingConfig =  {
  chartsDataFile: 'https://data.covid19.ca.gov/data/infections-by-group/infections-by-group-california.json',
  chartsStateDashTablesLoc: 'https://data.covid19.ca.gov/data/dashboard/',
  chartsStateDashTablesLocSparklineVaccines: 'https://data.covid19.ca.gov/data/dashboard/',
  chartsStateDashTablesLocPostvax: 'https://data.covid19.ca.gov/data/dashboard/',
}

const devOutputPath = 'docs/js/dashboard.js';
const prodOutputPath = 'pages/_buildoutput/dashboard.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;
const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") ? stagingConfig : defaultConfig;

export default {
  input: 'src/js/dashboard/index.js',
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


