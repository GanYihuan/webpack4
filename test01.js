/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-04-12 22:38:24
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-27 15:06:26
 */
const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('webpack.bundle.analyzer').BundleAnalyzerPlugin
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin') // 每次打包都会删掉原来的并重新打包
const CopyWebpackPlugin = require('copy-webpack-plugin') // 拷贝文件
const Happypack = require('happypack') // 多线打包
const HtmlWebpackPlugin = require('html-webpack-plugin') // 创建 HTML 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 CSS 提取到单独的文件中
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // css 压缩
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin') // js 压缩

module.exports = {
  optimization: {
    minimizer: [
      new MiniCssExtractPlugin(), // css 压缩
      new UglifyJsWebpackPlugin({ // js 压缩
        cache: true, // 缓存
        parallel: true, // 并发压缩
        sourceMap: true // 监控错误
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
    new HtmlWebpackPlugin({ // 创建 HTML 文件
      template: '',
      filename: 'index.html',
      minify: { // html 压缩
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true // 变成一行
      },
      hash: true // html 里引入的文件名加上 hash
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css', // 处理后生成文件的名称
      chunkFilename: '[name].chunk.css' // 非入口 chunk 文件的名称 (未被列在entry中，却又需要被打包出来的文件命名配置)
    }),
    new webpack.HotModuleReplacementPlugin(), // Enables Hot Module Replacement
    new webpack.NameModulesPlugin(), // 热加载时 module 版本号从数字改成文件名字 (长缓存优化)
    new webpack.NameChunksPlugin(), // 热加载时 chunk 版本号从数字改成文件名字
    new webpack.BannerPlugin(''), // 版权信息
    new webpack.DefinePlugin({ // create global constants which can be configured at compile time
      FLAG: 'true'
    }),
    new webpack.IgnorePlugin({ // IgnorePlugin prevents generation of modules for import or require calls matching the regular expressions or filter functions
      resourceRegExp: /^\.\/locale$/, // A RegExp to test the resource against
      contextRegExp: /moment$/ // (optional) A RegExp to test the context (directory) against
    }),
    new webpack.ProvidePlugin({ // Automatically load modules instead of having to import or require them everywhere
      $: 'jquery'
    })
  ]
}
