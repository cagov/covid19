const path = require('path');
const glob = require('glob');
const PATHS = {
  src: path.join(__dirname, 'pages')
};
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

// Minification options here -> https://github.com/DanielRuf/html-minifier-terser#options-quick-reference
const minificationOptions = {
  caseSensitive: true,
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: false,
  removeScriptTypeAttributes: true,
  minifyJS: true,
  minifyCSS: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true
};
const minificationOptionsWithComments = JSON.parse(JSON.stringify(minificationOptions));
minificationOptionsWithComments.removeComments = false;

module.exports = {
  entry: {
    style: ['./src/css/_index.scss']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.scss$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'css/build/home.css'
    }),
    new PurgecssPlugin({
      paths: [`${PATHS.src}/_includes/main.njk`, `${PATHS.src}/_includes/header.njk`, `${PATHS.src}/_includes/news-feed-home.html`, `${PATHS.src}/_includes/footer.njk`, `${PATHS.src.replace('/pages','')}/src/js/arrow/template.html`]
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'css/fonts/',
              publicPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img',
              publicPath: '../img'
            }
          }
        ]
      },
      {
        test: /\.xml$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'docs/')
  }
};
