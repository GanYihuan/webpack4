let webpack = require('webpack')
let path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    filename: '_dll_[name].js', // 产生的文件名
    path: path.resolve(__dirname, 'build'),
    library: '_dll_[name]' // 将你的 bundle 暴露为名为全局变量，通过此名称来 import
    // libraryTarget: 'var' // 控制以不同形式暴露
  },
  plugins: [
    new webpack.DllPlugin({ // 某种方法实现了拆分 bundles
      name: '_dll_[name]', // 暴露出的 Dll 的函数名
      path: path.resolve(__dirname, 'build', 'manifest.json')
    })
  ]
}
