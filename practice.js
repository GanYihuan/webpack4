const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HappyPack = require('happypack')

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
      new UglifyJsWebpackPlugin({
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
          minSize: 0,
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
    extension: ['.js', '.css', '.json', '.vue'],
    maniFields: ['style', 'main'],
    alias: {
      jquery: ''
    }
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 8080,
    progress: true,
    hot: true,
    compress: true,
    open: true,
    contentbase: './build',
    proxy: {
      '/api': {
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
            loader: 'css-laoder'
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
        test: /\.(png|jpeg|gif)$/,
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
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, 'build', 'manifest.json')
    }),
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
            formatter: require('eslint-friendly-formaater')
          },
          enforece: 'pre'
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedChunksPlugin()
  ]
}
