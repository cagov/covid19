import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/js/survey/index.js',
  output: {
    file: 'pages/_buildoutput/survey.js',
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
