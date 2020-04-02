import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/js/alerts/index.js',
  output: {
    file: 'pages/_includes/alerts.js',
    format: 'esm'
  },
  plugins: [resolve(), json(), terser()]
};
