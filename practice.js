
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HappyPack = require('happypack')

module.exports = {
  mode: 'production',
  entry: {
    index: '',
    other: ''
  },
  output: {
    filename: '[name].[hash:5].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimizer: [
      new UglifyJSWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCssAssetsWebpackPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'initial',
          miniSize: 0,
          miniChunks: 2
        },
        vendor: {
          prioprity: 1,
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
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
    extension: ['.js', '.css', '.json', '.vue'],
    mainFields: ['style', 'main'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 8080,
    hot: true,
    progress: true,
    open: true,
    compress: true,
    contentBase: './build',
    proxy: {
      'api': {
        target: 'http://localhost:3000',
        pathRewrite: { '/api': '' }
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
              insertAt: 'top'
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-laoder'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          },
          {
            loader: 'url-loader',
            options: {
              limit: 3000,
              outputPath: '/img/'
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
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    }),
    new webpack.DllPlugin({
      name: '__dll_[name]',
      path: path.resolve(__dirname, 'build', 'manifest.json')
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new CleanWebpackPlugin({}),
    new CopyWebpackPlugin([
      {
        from: './doc',
        to: './'
      }
    ]),
    new webpack.BannerPlugin('gan'),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('production')
    }),
    new webpack.IgnorePlugin(/a/, /a/),
    new HappyPack({
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
              ['@babel/plugin-transform-runtime']
            ]
          }
        },
        {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-firendly-formatter')
          },
          enforece: 'pre'
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedChunksPlugin()
  ]
}
