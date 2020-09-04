import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const devOutputPath = 'docs/js/built.js';
const prodOutputPath = 'pages/_buildoutput/built.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;

export default {
  input: 'src/js/index.js',
  output: {
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
