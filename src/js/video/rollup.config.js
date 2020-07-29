import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'src/js/video/index.js',
  output: {
    file: 'pages/_includes/video.js',
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
