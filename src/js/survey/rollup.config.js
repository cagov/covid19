import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/js/survey/index.js',
  output: {
    file: 'pages/_includes/survey.js',
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
