const path = require('path');
const glob = require('glob');
const PATHS = {
  src: path.join(__dirname, 'src')
};
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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

const allChunks = ['style', 'roads', 'shelters', 'lifeline'];

// usage
//    excludeChunks: excludeChucksExcept("roads"),
//    excludeChunks: excludeChucksExcept("roads","alerts"),
const excludeChucksExcept = (...args) => allChunks.filter(x => !args.includes(x));

module.exports = {
  entry: {
    style: ['./src/css/_index.scss'],
    roads: ['./src/js/roads/index.js'],
    shelters: ['./src/js/shelters/index.js'],
    lifeline: ['./src/js/lifeline/index.js']
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
    new CopyPlugin([
      { from: 'src/serverfiles' },
      { from: 'src/img', to: 'img' }
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'css/[chunkhash].css'
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*']
    }),
    new HtmlWebpackPlugin({
      filename: 'en/index.html',
      template: 'src/index.html',
      excludeChunks: allChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'en/news/index.html',
      template: 'src/news/index.html',
      excludeChunks: allChunks,
      minify: minificationOptionsWithComments
    }),
    new HtmlWebpackPlugin({
      filename: 'news/post.html',
      template: 'src/news/post.html',
      excludeChunks: allChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'en/about/index.html',
      template: 'src/about/index.html',
      excludeChunks: allChunks,
      minify: minificationOptions
    }),

    new HtmlWebpackPlugin({
      filename: 'en/apply-for-disability-insurance-benefits/index.html',
      template:
        'src/services/apply-for-disability-insurance-benefits/index.html',
      excludeChunks: allChunks,
      minify: minificationOptions
    }),
    new HtmlWebpackPlugin({
      filename: 'en/apply-for-cal-grant/index.html',
      template: 'src/services/apply-for-cal-grant/index.html',
      excludeChunks: allChunks,
      minify: minificationOptions
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
    filename: 'js/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'public/')
  }
};
