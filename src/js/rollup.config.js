import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import alerts from './alerts/rollup.config';
import es5 from './rollup.config.es5';
import plasma from './plasma/rollup.config';
import survey from './survey/rollup.config';
import telehealth from './telehealth/rollup.config';
import whatwhere from './what-open-where/rollup.config';
import video from './video/rollup.config';

export default [
  {
    input: 'src/js/index.js',
    output: {
      file: 'pages/_includes/built.js',
      format: 'esm'
    },
    plugins: [resolve(), terser()]
  },
  alerts,
  es5,
  plasma,
  survey,
  telehealth,
  whatwhere,
  video
];
