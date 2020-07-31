import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import alerts from './alerts/rollup.config';
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
  {
    input: 'src/js/es5.js',
    output: {
      file: 'docs/js/es5.js',
      format: 'umd'
    },
    moduleContext: {
      // https://rollupjs.org/guide/en/#error-this-is-undefined
      [path.resolve('./node_modules/whatwg-fetch/fetch.js')]: 'window'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              targets: {
                browsers: '> 1%'
              }
            }
          ]
        ]
      }),
      terser()
    ]
  },
  alerts,
  plasma,
  survey,
  telehealth,
  whatwhere,
  video
];
