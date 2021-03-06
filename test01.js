/*
 * @Description:
 * @Author: GanEhank
 * @Date: 2019-04-12 22:38:24
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-31 16:13:59
 */
const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('webpack.bundle.analyzer').BundleAnalyzerPlugin
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin') // 打包时删掉原来的包重新打包
const CopyWebpackPlugin = require('copy-webpack-plugin') // 拷贝文件
const Happypack = require('happypack') // 多线打包
const HtmlWebpackPlugin = require('html-webpack-plugin') // 创建 HTML 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取 CSS
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // css 压缩
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin') // js 压缩

module.exports = {
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(), // css 压缩
      new UglifyJsWebpackPlugin({ // js 压缩
        sourceMap: true, // 监控错误
        cache: true, // 缓存
        parallel: true // 并发压缩
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
    new WebpackBundleAnalyzerPlugin(), // 打包分析
    new CleanWebpackPlugin(), // 每次打包都会删掉原来的并重新打包
    new CopyWebpackPlugin([ // 拷贝文件
      {
        from: '',
        to: ''
      }
    ]),
    new HtmlWebpackPlugin({
      template: '', // 模板
      filename: 'index.html', // 生成文件名
      minify: { // html 压缩
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true // 变成一行
      },
      hash: true // html 引入的文件名加 hash
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css', // 处理后生成文件名称
      chunkFilename: '[name].chunk.css' // 未列在 entry, 又需要被打包出来的文件命名
    }),
    new webpack.HotModuleReplacementPlugin(), // 启用热模块更换
    new webpack.NameModulesPlugin(), // 热加载时 module 版本号从数字改成文件名字 (长缓存优化)
    new webpack.NameChunksPlugin(), // 热加载时 chunk 版本号从数字改成文件名字
    new webpack.BannerPlugin(''), // 版权信息
    new webpack.DefinePlugin({ // 定义环境变量
      FLAG: 'true'
    }),
    new webpack.IgnorePlugin({ // prevents generation of modules for import or require calls matching the regular expressions or filter functions
      resourceRegExp: /^\.\/locale$/, // A RegExp to test the resource against
      contextRegExp: /moment$/ // (optional) A RegExp to test the context (directory) against
    }),
    new webpack.ProvidePlugin({ // 自动加载模块
      $: 'jquery'
    })
  ]
}
