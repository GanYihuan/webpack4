module.exports = {
	 devServer: { // 开发服务器配置
    port: 8080, // 启动端口
    lazy: true, // 请求时才编译
    https: true, // 使用自签名证书
    inline: false, // 构建消息出现在浏览器控制台
    overlay: true, // 编译器错误警告时，浏览器中显示全屏覆盖层
    progress: true, // 运行过程
    compress: true, // 压缩
    hot: true, // 热更新
    hotOnly: true, // 构建失败时不刷新页面回退
    open: true, // 告诉 server 启动后打开浏览器
    openPage: '', // 指定打开浏览器时页面
    contentBase: './build', // 静态文件服务
    historyApiFallback: { // 404 页面
      rewrites: [ // 重定向规则
        {
          from: /\.*/,
          to: '/404.html'
        }
      ]
    },
    proxy: { // 重写方式把请求代理到 express 服务上
      '/react/api': { // axios.get('/react/api/header.json')
        target: '', // 远端服务器
        changeOrigin: true, // 不保留主机头原点
        headers: { // http 请求头
          Cookie: ''
        },
        logLevel: 'debug', // 控制台显示代理信息
        pathRewrite: { // 重定向接口请求
          'header.json': 'demo.json'
        }
      }
    },
    before(app) { // 前端模拟数据
      app.get('/user', (req, res) => {
        res.json({ name: 'ganbefore' })
      })
    }
  }
}
