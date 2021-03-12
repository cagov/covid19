import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const devOutputPath = 'docs/js/dashboard-v1.js';
const prodOutputPath = 'pages/_buildoutput/dashboard-v1.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;

export default {
  input: 'src/js/dashboard-v1/index.js',
  output: {
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
