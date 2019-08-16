const webpack = require('webpack')
const webpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MinicssExtractPlugin = require("mini-css-extract-plugin")
const OptimizecssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')

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
    minimizer: [
      new UglifyJsWebpackPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      }),
      new OptimizecssAssetsWebpackPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsynscRequests: 5,
      maxInitialRequests: 3,
      automaticDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          filename: '',
          priority: 1,
          test: /[\\/]node_modules[\\/]/
        },
        default: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          filename: '',
          priority: -1,
          reuseExistingChunk: true
        }
      }
    }
  },
  watch: true,
  watchOptions: {
    poll: 3000,
    aggregateTimeout: 300,
    ignored: /node_modules/
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    extensions: ['.js', '.vue'],
    mainFields: ['style', 'main'],
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
    https: true,
    overlay: true,
    lazy: true,
    contentBase: './build',
    historyApiFallback: {
      htmlAcceptHeaders: ['text/html'],
      rewrites: [
        {
          from: /\.*/,
          to: ''
        }
      ],
      proxy: {
        '/react/api': {
          target: '',
          changeOrigin: true,
          headers: {
            Cookie: ''
          },
          logLevel: 'debug',
          pathRewrite: {
            '': ''
          }
        }
      },
      before(app) {
        app.get('/user', (req, res) => {
          res.json({name: ''})
        })
      }
    }
  },
  externals: {
    jquery: '$'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '',
      filename: '',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MinicssExtractPlugin({
      filename: '',
      chunkFilename: '[name].chunk.css'
    }),
    new webpackBundleAnalyzer(),
    new CopyWebpackPlugin(),
    new CleanWebpackPlugin([
      {
        from: '',
        to: ''
      }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NameModulesPlugin(),
    new webpack.NameChunksPlugin(),
    new webpack.BunnerPlugin(''),
    new webpack.DefinePlugin({
      DEV: JSON.stringfy('')
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}
