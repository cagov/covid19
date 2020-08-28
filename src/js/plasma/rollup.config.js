import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/js/plasma/index.js',
  output: {
    file: 'pages/_buildoutput/plasma.js',
    format: 'esm'
  },
  plugins: [resolve(), json(), terser()]
};
