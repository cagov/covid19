import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
// import babel from '@rollup/plugin-babel';

export default {
  input: 'src/js/es5.js',
  output: {
    file: 'docs/js/es5.js',
    format: 'cjs'
  },
  moduleContext: {
    // whatwg-fetch angers Rollup due to ancient use of 'this'.
    // This fix is not essential to function. It removes a warning during the build process.
    // https://rollupjs.org/guide/en/#error-this-is-undefined
    [path.resolve('./node_modules/whatwg-fetch/fetch.js')]: 'window'
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    /*
    // This babel config is functional.
    // However, buble is 4x faster and the resulting file is half the size.
    // Going with buble for now.

    babel({
      babelHelpers: 'runtime',
      exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3,
            targets: {
              browsers: '> 1%'
            }
          }
        ]
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true
          }
        ]
      ]
    }),
    */
    buble(),
    terser()
  ]
};
