const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production', // 模式
  entry: {
    index: ''
  },
  output: {
    publicPath: '',
    filename: '[name].[hash:5].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'MyLibrary',
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
      maxInitialReqeusts: 3,
      automaticNameDelimiter: '~',
      name: true,
      chacheGroups: {
        vendors: {
          priority: 1,
          test: /node_modules/,
          filename: 'vendors.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        default: {
          priority: -1,
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
    extensions: ['.js', '.css', '.json'],
    mainFields: ['style'],
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
      htmlAcceptHeaders: [''],
      rewrites: [
        {
          from: '',
          to: ''
        }
      ]
    },
    proxy: {
      '/api': {
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
        res.json({ name: '' })
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
        use: 'expose-laoder?$'
      },
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules'
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
        test: /\.(png)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:5].[ext]',
              limit: 2048,
              publicPath: '',
              outputPath: 'dist/',
              useRelativePath: true
            }
          }
        ]
      },
      {
        test: /\.(eot)$/,
        use: [
          {
            loader: 'url-loader',
            optionis: {
              name: '[name].[hash:5].[ext]',
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
      },
      {
        test: path.resolve(__dirname, ''),
        use: [
          {
            loader: 'imports-loader',
            options: {
              $: 'jquery'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: '',
      filename: '',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: ''
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: '',
        to: ''
      }
    ]),
    new webpack.BannerPlugin('gan'),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('gan')
    }),
    new webpack.IgnorePlugin(/module/, /moment/),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { useBulitIns: 'usage' }]
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators']
            ]
          }
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.NamedChunksPlugin()
  ]
}
