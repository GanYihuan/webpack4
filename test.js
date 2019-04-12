// const webpack = require('webpack')
// const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const Happypack = require('happypack')

// module.exports = {
//   mode: 'production',
//   entry: {
//     index: '',
//     other: ''
//   },
//   output: {
//     filename: '[name].[hash:5].js',
//     path: path.resolve(__dirname, 'dist'),
//     library: '',
//     libraryTarget: 'umd'
//   },
//   optimization: {
//     minimizer: [
//       new UglifyJsWebpackPlugin({
//         cache: true,
//         parallel: true,
//         sourceMap: true
//       }),
//       new OptimizeCssAssetsWebpackPlugin({})
//     ],
//     splitChunks: {
//       cacheGroups: {
//       }
//     }
//   }
// }
