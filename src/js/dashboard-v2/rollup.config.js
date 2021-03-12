import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';


const defaultConfig = {
  chartsDataFile: 'https://files.covid19.ca.gov/data/infections-by-group/infections-by-group-california.json',
}
const stagingConfig =  {
  chartsDataFile: 'https://raw.githubusercontent.com/cagov/covid-static/auto-2021-03-12-V2-Stats-Update-2021-03-12-09-21-12/data/infections-by-group/infections-by-group-california.json',
}

const devOutputPath = 'docs/js/dashboard-v2.js';
const prodOutputPath = 'pages/_buildoutput/dashboard-v2.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;
const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") ? stagingConfig : defaultConfig;

export default {
  input: 'src/js/dashboard-v2/index.js',
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
            // terser()
          ]
};


