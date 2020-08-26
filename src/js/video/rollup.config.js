import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/js/video/index.js',
  output: {
    file: 'pages/_buildoutput/video.js',
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
