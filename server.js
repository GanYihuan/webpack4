// 1) 2)
// let express = require('express')
// let app = express()
// app.get('/api/user', (req, res) => {
//   res.json({name: 'gan1'})
// })
// app.listen(3000)

// 3)
let express = require('express')
let app = express()
let webpack = require('webpack')
let middle = require('webpack-dev-middleware') // 服务端启动 webpack
let config = require('./webpack.config.js')
let compiler = webpack(config)

app.use(middle(compiler))
app.get('/user', (req, res) => {
  res.json({ name: 'gan3' })
})
app.listen(3000)
// chrome: http://localhost:3000/api/user
