/*
 * @Description: test
 * @Author: GanEhank
 * @Date: 2019-08-26 18:50:49
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-31 17:38:01
 */
const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.html'
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
    runtimeChunk: {
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
      new OptimizeCssAssetsWebpackPlugin(),
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
    mainFiles: ['index'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'cheap-module-source',
  devServer: {
    port: 8080,
    lazy: true,
    https: true,
    inline: false,
    overlay: true,
    progress: true,
    compress: true,
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
          Cookie: ''
        },
        logLevel: 'debug',
        pathRewrite: {
          'header.json': 'demo.json'
        }
      }
    },
    before(app) {
      app.get('/user', (req, res) => {
        res.json({ name: 'gan' })
      })
    }
  },
  externals: {
    jquery: '$'
  },
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
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
              transfrom: ''
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
        test: /\.js$/,
        use: [
          {
            loader: 'Happypack/loader?id=js',
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/
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
        test: /\.(eot|woff2?|ttf|svg)$/,
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
        test: /\.html$/,
        use: [
          {
            loader: 'imt-withimg-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new WebpackBundleAnalyzerPlugin()
    new CleanWebpackPlugin()
    new CopyWebpackPlugin([
      {
        from: '',
        to: ''
      }
    ])
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
      filename: '/src/main.css',
      chunkFilename: '[name].chunk.css'
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
    }),
    new webpack.HotModuleReplacemenetPlugin(),
    new webpack.NameModulesPlugin(),
    new webpack.NameChunksPlugin(),
    new webpack.BannerPlugin('gan'),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale/,
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
