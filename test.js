/*
 * @Description: test
 * @Author: GanEhank
 * @Date: 2019-08-26 18:50:49
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-27 14:36:35
 */
const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('webpack.bundle.analyzer').WebpackBundleAnalyzerPlugin
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack')
const CopyWebpackPlugin = reqire('copy-webpack-plugin')
const Happypack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
  optimization: {
    minimizer: [
      new MiniCssExtractPlugin(),
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
      filename: 'css/main.css',
      chunkFilename: '[name].chunk.css'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NameModulesPlugin(),
    new webpack.NameChunksPlugin(),
    new webpack.BannerPlugin(),
    new webpack.DefindePlugin({
      FLAG: 'true'
    }),
    new webpack.IgnorePlugin(/\\.locale/,/moment/),
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}
