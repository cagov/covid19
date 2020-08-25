import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/js/what-open-where/index.js',
  output: {
    file: 'pages/_buildoutput/what-open-where.js',
    format: 'esm'
  },
  plugins: [resolve(), json(), terser()]
};


