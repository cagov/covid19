import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/js/alerts/index.js',
  output: {
    file: 'pages/_buildoutput/alerts.js',
    format: 'esm'
  },
  plugins: [resolve(), json(), terser()]
};
