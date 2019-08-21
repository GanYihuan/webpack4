/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-04-12 22:38:24
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-22 00:09:02
 */
const webpack = require('webpack')
const path = require('path')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extractPlugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const Happypack = require('happypack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: ''
  },
  output: {
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    library: '',
    libraryTarget: ''
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
    minimizer: [
      new UglifyJsWebpackPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      }),
      new OptimizeCssAssetsWebpackPlugin({})
    ],
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
          test: /[\\/]node_modules[\\/]/,
          filename: 'vendors.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 0
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
    }
  },
  watch: true,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: /node_modules/
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    extensions: ['js'],
    mainFields: ['style'],
    alias: {
      bootrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  externals: {
    jquery: '$'
  },
  plugins: [
    new WebpackBundleAnalyzer(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: '',
        to: ''
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NameModulesPlugin(),
    new webpack.NameChunksPlugin(),
    new webpack.BannerPlugin(''),
    new webpack.DefinePlugin({
      FLAG: 'true'
    }),
    new webpack.IgnoredPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}
