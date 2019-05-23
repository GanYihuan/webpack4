const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: {
    index: '',
    other: ''
  },
  output: {
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[contenthath].js',
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
          test: '',
          filename: 'vendors.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        default: {
          priroty: -1,
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
    extensions: ['.js', '.css'],
    mainFileds: ['style', 'main'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 8080,
    inline: false,
    progress: true,
    compress: true,
    hot: true,
    hotOnly: true,
    open: true,
    openPage: '',
    https: 'true',
    overlay: true,
    lazy: true,
    contentBase: '',
    historyApiFallback: {
      htmlAcceptHeaders: [''],
      rewrites: [
        {
          from: '',
          to: ''
        }
      ]
    },
    proxy: {
      '': {
        target: '',
        changeOring: true,
        headers: {},
        logLevel: 'debug',
        pathRewrite: {
          '': ''
        }
      }
    },
    before(app) {
      app.get('/user', (req, res) => {
        res.json({ name: '' })
      })
    }
  }
}
