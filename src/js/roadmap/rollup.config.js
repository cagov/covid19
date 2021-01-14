import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

const devOutputPath = 'docs/js/roadmap.js';
const prodOutputPath = 'pages/_buildoutput/roadmap.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;

export default {
  input: 'src/js/roadmap/index.js',
  output: {
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), json()]
};
