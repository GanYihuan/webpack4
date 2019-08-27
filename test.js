/*
 * @Description: test
 * @Author: GanEhank
 * @Date: 2019-08-26 18:50:49
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-27 11:27:22
 */
module.exports = {
  devServer: {
    port: 8080,
    lazy: true,
    https: true,
    inline: false,
    overlay: true,
    compress: true,
    progress: true,
    hot: true,
    hotOnly: true,
    open: true,
    openOnly: true,
    contentBase: './build',
    historyApiFallback: {
      rewrite: [
        {
          from: /\.*/,
          to: './404.html'
        }
      ]
    },
    proxy: {
      '/react/api': {
        target: '',
        changeOrigin: true,
        headers: {
          Cookie: ''
        },
        logLevel: 'debug',
        pathRewrite: {
          '': ''
        }
      }
    },
    before(app) {
      app.get('/user', (req, res) => {
        res.json({ name: '' })
      })
    }
  }
}
