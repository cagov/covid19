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
  chartsDataFile: 'https://raw.githubusercontent.com/cagov/covid-static/staging/data/infections-by-group/infections-by-group-california.json',
  chartsStateDashTablesLoc: 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboardTables_Staging/data/dashboard/',
  chartsStateDashTablesLocSparklineVaccines: 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboardVaccines_Sparkline_Staging/data/dashboard/',
  chartsStateDashTablesLocPostvax: 'https://raw.githubusercontent.com/cagov/covid-static-data/CovidStateDashboardPostvax_Staging/data/dashboard/',
}

const devOutputPath = 'docs/js/chart-renderer.js';
const prodOutputPath = 'pages/_buildoutput/chart-renderer.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;
const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") ? stagingConfig : defaultConfig;

export default {
  input: 'src/js/chart-renderer/index.js',
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


