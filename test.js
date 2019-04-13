const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssWebpackPlugin = require('optimize-css-assets-webpack-plugin')
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
      new OptimizeCssWebpackPlugin({}),
      new UglifyJsWebpackPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncrequests: 5,
      maxInitialRequests: 3,
      automaticenameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          priority: 1,
          test: /node_modules/,
          filename: 'vendors',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        default: {
          priority: -1,
          chunks: 'intial',
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
    extensions: ['.js', '.css', '.json', '.vue'],
    mainFields: ['style', 'main'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 8000,
    inline: false,
    progress: true,
    hot: true,
    hotOnly: true,
    open: true,
    openPage: '',
    https: true,
    overlay: true,
    lazy: true,
    compress: true,
    contentBase: './build',
    historyApiFallback: {
      rewrites: [
        {
          from: '',
          to: ''
        }
      ]
    },
    proxy: {
      '/': {
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
        test: require.resolve('jquery'),
        use: 'expose-loader?$'
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
            loader: 'postcss-loader'
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
              useRelativepath: true
            }
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
        loader: 'img-loader',
        options: {
          pngquant: {
            quality: 80
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-withimg-loader'
        }
      },
      {
        test: path.resolve(__dirname, './src/app.js'),
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
    new HtmlWebpackPlugin({
      template: '',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true
      },
      hash: true
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
      DEV: JSON.stringify('pro')
    }),
    new webpack.IgnorePlugin(),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }]
            ]
          }
        },
        {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          },
          enfore: 'pre'
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedChunksPlugin()
  ]
}
