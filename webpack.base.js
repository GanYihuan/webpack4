const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJswebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
    other: './src/other.js'
  },
  output: {
    filename: '[name].[hash:5].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimizer: [
      new UglifyJswebpackPlugin({
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
          minChunks: 2
        },
        vendor: {
          priority: 1,
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
    extensions: ['.js', '.css', '.json', '.vue'],
    mainFields: ['style', 'main'],
    alias: {
      bootstrap: ''
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    port: 8080,
    open: true,
    progress: true,
    contentBase: './build',
    compress: true,
    before(app) {
      app.get('/user', (req, res) => {
        res.json({ name: 'ga' })
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
            loader: 'url-loader',
            options: {
              limit: 1,
              outptuPath: '/img/'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-withimg-laoder'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    }),
    new HtmlWebpackPlugin({
      tempalte: './src/index.html',
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
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './doc',
        to: './'
      }
    ]),
    new webpack.BannerPlugin('gan'),
    new webpack.DefinePlugin({
      DEV: JSON.stringify('production'),
      FLAG: 'true'
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
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
              ['@babel/plugin-proposal-decorators', { 'legacy': true }], // 类和对象装饰器
              ['@babel/plugin-proposal-class-properties', { 'loose': true }], // 属性初始化
              ['@babel/plugin-transform-runtime'], // 能写 es6+ 新方法
              ['@babel/plugin-syntax-dynamic-import'] // 动态加载 import
            ]
          }
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
    new webpack.NamedModulesPlugin()
  ]
}
