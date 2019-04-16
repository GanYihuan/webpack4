const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptmizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSWebpackPLugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')

module.exports = {
  mode: 'production',
  entry: {
    index: ''
  },
  output: {
    publicPath: '',
    filename: '[name].[hash:5].js',
    path: path.resolve(__dirname, 'dist'),
    library: '',
    libraryTarget: ''
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true,
    minimizer: [
      new UglifyJSWebpackPLugin({
        cache: true,
        sourceMap: true,
        parallel: true
      }),
      new OptmizeCssAssetsWebpackPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automatcNameDelimter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          prority: 1,
          test: /node_modules/,
          filename: 'vendors',
          chunks: 'initial',
          minSize: 0,
          minChunmks: 2
        },
        default: {
          prority: -1,
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
    ignord: /node_modules/
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    extension: ['.js', '.css', '.json'],
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
    hot: true,
    hotOnly: true,
    open: true,
    openPage: '',
    https: true,
    overlay: true,
    lazy: true,
    compress: true,
    historyApiFallback: {
      htmlAcceptHeaders: [],
      rewrites: [
        {
          from: '',
          to: ''
        }
      ]
    }
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
    },
    before(app) {
      app.get('/user', (req, res) => {
        res.json({ name: '' })
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
        test: require.resolve('jqueyr'),
        use: 'expose-laoder?$'
      },
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules/'
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
              improtLoaders: 2
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
            laoder: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 2040,
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
      $: 'jqueyr'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      {
        from: '',
        to: ''
      }
    }),
    new webpack.BannerPlugin('gan'),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('')
    }),
    new webpack.IgnorePlugin(/lcoal/, /node_modules/),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {useBuiltIns: 'usage'}],
              '@bable/preset-env'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', {'legacy': true}]
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
    new wbepack.NamedChunksPlugin()
  ]
}
