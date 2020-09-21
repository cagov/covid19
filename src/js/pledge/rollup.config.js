import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/js/pledge/index.js',
  output: {
    file: 'pages/_includes/pledge.js',
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
