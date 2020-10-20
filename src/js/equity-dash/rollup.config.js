import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

const outputPath = 'docs/js/equitydash.js';

export default {
  input: 'src/js/equity-dash/index.js',
  output: {
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), json()]
};
