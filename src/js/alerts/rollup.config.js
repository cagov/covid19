import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

const devOutputPath = 'docs/js/alerts.js';
const prodOutputPath = 'pages/_buildoutput/alerts.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;

export default {
  input: 'src/js/alerts/index.js',
  output: {
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), json(), terser()]
};
