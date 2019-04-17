const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const Happypack = require('happypack')

module.exports = {
  mode: 'production',
  entry: {
    index: ''
  },
  output: {
    filename: '[name].[hash:5].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    library: '',
    libraryTarget: ''
  },
  optimization: {
    runttimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
    minimizer: [
      new UglifyJsWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCssAssetsWebpackPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 3000,
      minChunks: 2,
      maxAsyncRequests: true,
      maxIntialRequests: true,
      automaticNameDelimitter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          priority: 1,
          test: /node_modules/,
          minSize: 0,
          minChunks: 1,
          chunks: 'initial',
          filename: 'vendors.js'
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
    ignored: /node_moduels/
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    extensions: ['.js'],
    mainFields: ['style'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 8080,
    inline: false,
    hot: true,
    hotOnly: true,
    lazy: true,
    compress: true,
    progress: true,
    https: true,
    open: true,
    openPage: '',
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
          '/api': ''
        }
      }
    },
    before(app) {
      app.get('/user', (req, res) => {
        res.json({ name: 'gan' })
      })
    }
  },
  extrenals: {
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
        exclue: '/node_modules'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-laoder'
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
            loader: 'postcss-laoder',
            options: {
              sourceMap: true,
              importLoadrs: 2
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
              name: '[name]-[hash:5].[ext]',
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
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              ooutputPath: ''
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
            laoder: 'imports-loader',
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
      DEV: JSON.stringify('gan')
    }),
    new webpack.IgnorePlugin(/node_module/, /moment/),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage' }]
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
          enforce: 'pre'
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
