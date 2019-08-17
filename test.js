const webpack = require('webpack')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
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
    path: path.resolve(__driname, 'dist'),
    library: '',
    libraryTarget: 'umd'
  },
  optimization: {
    chunkFilename: {
      name: 'runtime'
    },
    usedExports: true,
    minimizer: [
      new UglifyJsWebpackPlugin({
        parallel: true,
        cache: true,
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
      automaticDelimieter: '~'
      name: true,
      cacheGroups: {
        vendors: {
          priority: 1,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          filename: 'vendors.js'
        },
        default: {
          priority: -1,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          filename: 'common.js',
          reuseExistingChunk: true
        }
      }      
    }
  },
  watch: true,
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 3000,
    ignored: /node_modules/
  },
  resolve: 'cheap-module-source-map',
  devServer: {
    port: 8080,
    compress: true,
    hot: true,
    hotOnly: true,
    progress: true,
    https: true,
    overlay: true,
    inline: false,
    open: true,
    openPage: '',
    lazy: true,
    contentBase: './build',
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
      app.get('', (req, res) => {
        res.json({name: ''})
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
        test: require.resolve('jquery'),
        use: 'expose-loader?$'
      },
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve(__driname, 'src'),
        exclude: /node_modules/
      },
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
        loader: 'img-loader',
        options: {
          pngquant: {
            quality: 80
          }
        }
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
    new WebpackBundleAnalyzer(),
    new HtmlWebpackPlugin({
      template: '',
      filename: '',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: '',
      chunkFilename: '[name].chunk.css'
    }),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [],
            plugins: []
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
          enforece: 'pre'
        }
      ]
    }),
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
      DEV: JSON.stringfy('')
    }),
    new webpack.IgnorePlugin(''),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}
