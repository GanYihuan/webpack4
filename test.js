const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')

module.exports = {
  mode: 'production',
  entry: {
    index: '',
    other: ''
  },
  output: {
    publicPath: '',
    filename: '[name].[hash:5].js',
    path: path.resolve(__dirname, 'dist'),
    library: '',
    libraryTarget: 'umd'
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
    minimizer: [
      new UglifyJSWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
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
          prority: 1,
          test: /node_modules/,
          filename: 'vendors.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        default: {
          prority: -1,
          chunks: 'initial',
          minSize: 0,
          reuseExstingChunk: true
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
    extensions: ['.js', '.css'],
    mainFields: ['style', 'main'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'source-map',
  devServer: {
    port: 8000,
    progress: true,
    hot: true,
    hotOnly: true,
    open: true,
    inline: false,
    openPage: '',
    https: true,
    overlay: true,
    lazy: true,
    compress: true,
    historyApiFallback: {
      rewrites: [
        {
          from: '',
          to: ''
        }
      ]
    }
  }
}
