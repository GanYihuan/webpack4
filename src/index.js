// expose-loader
// import $ from 'jquery'
// console.log(window.$)

// ProvidePlugin
console.log($)

// cdn
// import $ from 'jquery'
// console.log($)

require('@babel/polyfill')

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

// 1) js 中创建图片来引入
import './index.css'
import logo from './logo.png'
let image = new Image()
console.log(logo)
image.src = logo
document.body.appendChild(image)
// 2) css 中引入 background()
// 3) <img src='' />

// 跨域处理
let xhr = new XMLHttpRequest()
// 默认访问 http://localhost:8080 webpack-dev-server 转发到 3000
// xhr.open('GET', '/api/user', true) // 1)
xhr.open('GET', '/user', true) // 2)
xhr.onload = function () {
  console.log(xhr.response)
}
xhr.send()
