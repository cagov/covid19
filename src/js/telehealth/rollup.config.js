import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/js/telehealth/index.js',
  output: {
    file: 'pages/_buildoutput/telehealth.js',
    format: 'esm'
  },
  plugins: [resolve(), json(), terser()]
};
