import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const devOutputPath = 'docs/js/video.js';
const prodOutputPath = 'pages/_buildoutput/video.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;

export default {
  input: 'src/js/video/index.js',
  output: {
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
