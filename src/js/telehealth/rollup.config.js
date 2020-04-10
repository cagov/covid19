import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/js/telehealth/index.js',
  output: {
    file: 'pages/_includes/telehealth.js',
    format: 'esm'
  },
  plugins: [resolve(), json(), terser()]
};
