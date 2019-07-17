const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: {
    index: '',
    other: ''
  },
  output: {
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    library: '',
    libarryTarget: 'umd'
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
    ],
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
          test: /[\\/]node_modules[\\/]/,
          filename: 'vendors.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
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
  externals: {
    jquery: '$'
  },
  devtool: 'cheap-module-source-map', // 生产选择, 不会产生列，是一个单独的映射文件
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
    contentBase: './build',
    historyApiFallback: {
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'], // 指定文件类型, 匹配了才重定向
      rewrites: [ // 重定向规则
        {
          from: /\.*/,
          to: '/index.html'
        }
      ]
    }
  },
  module: {
    noParse: /jQuery/,
    rules: [
      {
        test: require.resolve('jquery'),
        use: 'expose-loader?$'
      },
      {
        test: /\.css/,
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
        test: /\.js$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      has: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css',
      chunkFilename: '[name].chunk.css'
    }),
    new CleanWebpackPlugin(),
    new WebpackBundleAnalyzerPlugin(),
    new CopyWebpackPlugin([
      {
        from: './doc',
        to: './'
      }
    ]),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage' }] // useBuiltIns 按需处理
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }], // 类和对象装饰器
              ['@babel/plugin-proposal-class-properties', { 'loose': true }], // 属性初始化
              // ['@babel/plugin-transform-runtime'], // 能写 es6+ 新方法, 写库的时候用
              ['@babel/plugin-syntax-dynamic-import'] // 动态加载 import
            ]
          }
        },
        {
          loader: 'imports-loader?this=>window' // console.log(this === window) 返回 true
        },
        {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter') // 报错时输入内容的格式更友好
          },
          enforce: 'pre' // pre 先执行, post 后执行
        }
      ]
    }),
    new webpack.ProviePlugin({
      $: 'jquery'
    })
  ]
}
