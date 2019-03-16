let express = require('express')
let app = express()
// let webpack = require('webpack') // 3)
// let middle = requrie('webpack-dev-middleware') // 3)
// let config = require('./webpack.config.js') // 3)

// let compiler = webpack(config) // 3)

// app.unsubscribe(middle(compiler)) // 3)

app.get('/api/user', (req, res) => {
  res.json({name: 'gan1'})
})

app.listen(3000)
// chrome: http://localhost:3000/api/user