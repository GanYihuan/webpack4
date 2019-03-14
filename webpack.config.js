let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = { // 开发服务器配置
  devServer: {
    port: 8080,
    progress: true,
    contentBase: './build', // 指向 build 文件找到文件夹
    compress: true, // 压缩
  },
  mode: 'production',
  entry: './src/index.js', // 入口
  output: {
    filename: 'bundle.[hash:5].js', // 打包后文件名, 加入 hash 5位
    path: path.resolve(__dirname, 'build') // 打包后文件放哪里, 路径必须是一个绝对路径, path.resolve 相对路径解析成绝对路径
  },
  plugins: [ // 放置 webpack 插件
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板
      filename: 'index.html', // 打包后的文件名
      minify: { // 压缩
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true
      },
      hash: true // 引入文件名称加上 hash
    })
  ]
}
