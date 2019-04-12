// expose-loader
// import $ from 'jquery'
// console.log(window.$)

// ProvidePlugin
// 1) js 中创建图片来引入
import './index.css'
import logo from './logo.png'

import 'bootstrap'

// import jquery from 'jquery'
import moment from 'moment' // 时间格式化
import 'moment/locale/zh-cn'

import React from 'react'
import { render } from 'react-dom' // 打包结果 console.log(6, '------') 简化代码

import aaa from './a'
import one from './one'
import $ from 'jquery'

console.log($, aaa, one, React, render)

// require('@babel/polyfill')

console.log('hello')

require('./index.css')
require('./index.less')

let fn = () => {
  console.log('es6')
}
fn()

@log
class A {
  a = 1
}
let a = new A()
console.log(a.a)
function log(target) {
  console.log(target, '23')
}

'aaa'.includes('a')
/* eslint-disable no-undef */
let image = new Image(100, 200)
console.log(logo)
image.src = logo
document.body.appendChild(image)
// 2) css 中引入 background()
// 3) <img src='' />

// 跨域处理
/* eslint-disable no-undef */
let xhr = new XMLHttpRequest()
// 默认访问 http://localhost:8080 webpack-dev-server 转发到 3000
xhr.open('GET', '/api/user', true) // 1)
xhr.open('GET', '/user', true) // 2)
xhr.onload = function () {
  console.log(xhr.response)
}
xhr.send()

// new webpack.DefinePlugin({ // 定义环境变量
let url = ''
if (DEV === 'dev') {
  url = 'http://localhost:3000'
} else {
  url = 'http://www.zhufengxueyuan.cn'
}
console.log(url)
console.log(typeof FLAG)
console.log(EXPRESSION)

moment.locale('zh-cn') // 设置语言
let r = moment().endOf('day').fromNow()
console.log(r)

// render(<h1>jsx</h1>, window.root)

// import 在生产环境中会自动去掉没用的代码
// scope hosting 作用域提升
let aa = 1
let bb = 2
let cc = 3
let dd = aa + bb + cc
console.log(dd, '-------')

console.log('index.js----')

let button = document.createElement('button')
button.innerHTML = 'button'
button.addEventListener('click', function() {
  console.log('click')
  // @babel/plugin-syntax-dynamic-import 懒加载
  import('./source.js').then(data => {
    console.log(data.default)
  })
})
document.body.appendChild(button)

if (module.hot) {
  module.hot.accept('./source', () => {
    console.log('accept hot')
    let source = require('./source')
    console.log(source)
  })
}
