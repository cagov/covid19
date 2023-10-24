import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const devOutputPath = 'docs/js/main.js';
const prodOutputPath = 'pages/_buildoutput/main.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;

const defaultConfig = {
    svg_path: 'https://files.covid19.ca.gov/img/generated/sparklines/'
}
const stagingConfig = {
    svg_path: 'https://raw.githubusercontent.com/cagov/covid-static/main/img/generated/sparklines_staging/'
}

const jsConfig = (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV == "development") ? stagingConfig : defaultConfig;

export default {
  input: 'src/js/main/index.js',
  output: {
    intro: 'const config = '+JSON.stringify(jsConfig),
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
