/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-26 18:50:49
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-27 10:47:50
 */
const path = require('path')

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
    libraryTarget: 'umd'
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsynsRequests: 5,
      maxInitialRequests: 3
      automaticDelimiter: '~'
      name: true,
      cacheGroups: {
        vendors: {
          pirority: 1,
          minSize: 0,
          minChunks: 2,
          chunks: 'initial',
          filename: 'vendors.js',
          test: /[\\/]node_modules[\\/]/
        },
        default: {
          priority: -1,
          minSize: 0,
          minChunks: 2,
          chunks: 'initial',
          filename: 'common.js',
          reuseExstingChunk: true
        }
      }
    }
  },
  watch: true,
  watchOptions: {
    poll: true,
    aggregateTimeout: true,
    ignored: /node_modules/
  },
  externals: {
    jquery: '$'
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    mainFields: ['style'],
    extensions: ['.js'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  module: {
    noParse: /jquery/
  }
}
