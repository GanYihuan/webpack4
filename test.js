/*
 * @Description: test
 * @Author: GanEhank
 * @Date: 2019-08-26 18:50:49
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-31 09:09:05
 */
const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('bundle-analyzer-plugin').WebpackBundleAnalyzerPlugin
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-extract-plugin')
const OptimizeCssAseetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const Happypack = require('happypack')

modeule.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    library: 'MyLibrary',
    libraryTarget: 'umd'
  },
  optimization: {
    runtimeChnk: {
      name: 'runtime'
    },
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          priority: 1,
          filename: 'vendors.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          test: /[\\/]node_modules[\\/]/
        },
        default: {
          priority: -1,
          filename: 'common.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new OptimizeCssAseetsWebpackPlugin(),
      new UglifyJsWebpackPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      })
    ]
  },
  watch: true,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: /node_modules/
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    extensions: ['.js'],
    mainFields: ['style'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  externals: {
    jquery: '$'
  },
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader
        ]
      }
    ]
  },
  plugins: [
    new WebpackBundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: '',
        to: ''
      }
    ]),
    new HtmlWebpackPlugin({
      template: '',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
      chunkFilename: '[name].[hash:5].js'
    }),
    new webpack.HotModuleReplacemenetPlugin(),
    new webpack.NameChunksPlugin(),
    new webpack.NameModulesPlugin(),
    new webpack.BannerPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new webpack.DefinePlugin({
      FLAG: 'true'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}
