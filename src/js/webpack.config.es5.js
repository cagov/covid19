const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    es5: [
      './src/js/es5.js'
    ]
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              modules: false,
              targets: {
                browsers: [
                  '> 1%'
                ]
              }
            }]
          ]
        }
      }
    }]
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../../docs/')
  }
};
