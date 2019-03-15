let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    home: './src/one.js',
    other: './src/other.js'
  },
  output: {
    filename: '[name].js', // [name] home,other
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [ // 放置 webpack 插件
    new HtmlWebpackPlugin({
      template: './src/test.html', // 模板
      filename: 'home.html', // 打包后的文件名
      chunks: ['home'] // 放入的模块
    }),
    new HtmlWebpackPlugin({
      template: './src/test.html', // 模板
      filename: 'other.html', // 打包后的文件名
      chunks: ['other'] // 放入的模块
    })
  ]
}