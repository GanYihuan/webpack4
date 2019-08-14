/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-04-12 22:38:24
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-14 22:21:31
 */
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MinicssExtracPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackBundleAnaylzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: {
    index: '',
    other: ''
  },
  output: {
    filename: '',
    chunkFilename: '',
    publicPath: '',
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
      new UglifyJsWebpackPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      }),
      new OptimizeCssAssetsWebpackPlugin({})
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
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'chap-module-source-map',
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
    contentbase: './build',
    historyApiFallback: {
      htmlAceeptHeaders: ['test/html'],
      rewrites: [
        {
          from: /\.*/,
          to: './index.html'
        }
      ]
    },
    proxy: {
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
        test: /\.html$/,
        use: [
          {
            loader: 'html-withimg-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MinicssExtracPlugin.loader,
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
        test: /\.js$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
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
        ],
        {
          loader: 'img-loader',
          options: {
            pngquant: {
              quality: 80
            }
          }
        }
      }
    ]
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
    new MinicssExtracPlugin({
      filename: '',
      chunkFilename: ''
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './doc',
        to: './'
      }
    ]),
    new WebpackBundleAnaylzer(),
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
              ['@babel/plugin-proposal-decorators', { 'legacy': true }],
              ['@babel/plugin-proposal-class-properties', { 'loose': true }],
              ['@babel/plugin-transform-runtime'],
              ['@babel/plugin-syntax-dynamic-import']
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
          enforece: 'pre'
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NameModulesPlugin(),
    new webpack.NameChunksPlugin(),
    new webpack.BundlePlugin(''),
    new webpack.DefinePlugin({
      DEV: JSON.stringfy('')
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}
