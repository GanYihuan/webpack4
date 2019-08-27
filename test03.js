/*
 * @Description:
 * @Author: GanEhank
 * @Date: 2019-08-26 19:31:22
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-27 11:30:07
 */
module.exports = {
	 devServer: { // 开发服务器
    port: 8080, // 端口
    lazy: true, // 请求时才编译
    https: true, // 自签名证书
    inline: false, // 控制台构建消息
    overlay: true, // 编译器错误警告时全屏覆盖层
    progress: true, // 运行过程
    compress: true, // 压缩
    hot: true, // 热更新
    hotOnly: true, // 构建失败时不刷新页面回退
    open: true, // 启动后打开浏览器
    openPage: '', // 指定浏览器页面
    contentBase: './build', // 静态文件服务
    historyApiFallback: { // 404 页面
      rewrites: [ // 重定向规则
        {
          from: /\.*/,
          to: '/404.html'
        }
      ]
    },
    proxy: { // 请求代理到服务上
      '/react/api': { // axios.get('/react/api/header.json')
        target: '', // 远端服务器
        changeOrigin: true, // 不保留主机头原点
        headers: { // http 请求头
          Cookie: ''
        },
        logLevel: 'debug', // 控制台代理信息
        pathRewrite: { // 重定向接口请求
          'header.json': 'demo.json'
        }
      }
    },
    before(app) { // 模拟数据
      app.get('/user', (req, res) => {
        res.json({ name: 'ganbefore' })
      })
    }
  }
}
