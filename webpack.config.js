let path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js', // 入口
  output: {
    filename: 'bundle.js', // 打包后文件名
    path: path.resolve(__dirname, 'build') // 打包后文件放哪里, 路径必须是一个绝对路径, path.resolve 相对路径解析成绝对路径
  }
}
