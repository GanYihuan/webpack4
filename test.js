/*
 * @Description: test
 * @Author: GanEhank
 * @Date: 2019-08-26 18:50:49
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-09-02 01:34:42
 */
const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').WebpackBundleAnalyzerPlugin
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MinicssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-asssets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: ''
  },
  output: {
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__driname, 'dist'),
    library: 'MyLibrary',
    libraryTarget: 'umd'
  },
  optimization: {
    chunks: 'all',
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticDelimiter: '~',
    name: true,
    cache: {
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
        useExistingChunk: true
      }
    }
    minimizer: [
      new MinicssExtractPlugin(),
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
    mainFileds: ['style'],
    mainFields: ['index'],
    alias: {
      boostrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 8080,
    lazy: true,
    https: true,
    inline: false,
    overlay: true,
    compress: true,
    progress: true,
    hot: true,
    hotOnly: true,
    open: true,
    openPage: '',
    contentBase: './build',
    historyApiFallback: {
      rewrites: [
        {
          from: /\.*/,
          to: '/404.html'
        }
      ]
    },
    proxy: {
      '/react/api': {
        target: '',
        changeOrigin: true,
        headers: {
          Cookie
        },
        logLevel: 'debug',
        pathRewrite: {
          'header.json': 'demo.json'
        }
      }
    },
    before(app) {
      app.get('/user', (req, res) => {
        res.json({name: 'gan'})
      })
    }
  },
  externals: {
    jquery: '$'
  },
  module: {
    noParse: /jquery/
    rules: [
      {
        test: /\.css$/,
        use: [
          MinicssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader?$'
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'Happypack?loader$id=js',
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
              singleton: true,
              modules: true,
              insertAt: 'top',
              insertInto: '#app',
              transform: ''
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 2048,
              publicPath: '',
              outputPath: 'dist/',
              useRelativePath: true
            }
          },
          {
            loader: 'img-loader',
            options: {
              pngquant: {
                quality: 80
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg$)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              outputPath: ''
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-withimg-loader'
          }
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
        removeAttributequotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MinicssExtractPlugin({
      filename: './css/main.css',
      chunkFilename: '[name].chunk.css'
    }),
    new webpack.HotModuleReplacemenetPlugin(),
    new webpack.NameModulesPlugin(),
    new webpack.NameChunksPlugin(),
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
    }),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              []
            ],
            plugins: [
              []
            ]
          }
        },
        {
          loader: 'imports-loader?this=>window'
        },
        {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          },
          enforce: 'pre'
        }
      ]
    })
  ]
}
