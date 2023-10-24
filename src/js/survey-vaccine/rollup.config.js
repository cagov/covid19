import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';


const devOutputPath = 'docs/js/survey-vaccine.js';
const prodOutputPath = 'pages/_buildoutput/survey-vaccine.js';
const outputPath = (process.env.NODE_ENV === 'development') ? devOutputPath : prodOutputPath;

export default {
  input: 'src/js/survey-vaccine/index.js',
  output: {
    file: outputPath,
    format: 'esm'
  },
  plugins: [resolve(), terser()]
};
