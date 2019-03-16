// 1) 2)
// let express = require('express')
// let app = express()
// app.get('/user', (req, res) => {
//   res.json({name: 'gan1'})
// })
// app.listen(3000)

// 3)
let express = require('express')
let app = express()
let webpack = require('webpack')
let middle = require('webpack-dev-middleware')
let config = require('./webpack.config.js')
let compiler = webpack(config)
app.use(middle(compiler))
app.get('/user', (req, res) => {
  res.json({name: 'gan2'})
})
app.listen(3000)
// chrome: http://localhost:3000/api/user