const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
    libarary: '',
    libraryTarget: 'umd'
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
    minimizer: [
      new UglifyJsWebpackPlugin({
        cache: true,
        sourceMap: true,
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
          priorty: 1,
          test: /[\\/]node_modules[\\/]/,
          filename: 'vendors.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        default: {
          priority: -1,
          filename: 'common.js',
          minSize: 0,
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    }
  }
}
