/*
 * @Description: test
 * @Author: GanEhank
 * @Date: 2019-08-26 18:50:49
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-31 08:56:43
 */
const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('bundle-analyzer-plugin').WebpackBundleAnalyzerPlugin
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-extract-plugin')
const OptimizeCssAseetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const Happypack = require('happypack')

modeule.exports = {
  optimization: {
    minimizer: [
      new OptimizeCssAseetsWebpackPlugin(),
      new UglifyJsWebpackPlugin({
        sourceMap: true,
        cache: true,
        parallel: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader
        ]
      }
    ]
  },
  plugins: [
    new WebpackBundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: '',
        to: ''
      }
    ]),
    new HtmlWebpackPlugin({
      template: '',
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
      chunkFilename: '[name].[hash:5].js'
    }),
    new webpack.HotModuleReplacemenetPlugin(),
    new webpack.NameChunksPlugin(),
    new webpack.NameModulesPlugin(),
    new webpack.BannerPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new webpack.DefinePlugin({
      FLAG: 'true'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}
