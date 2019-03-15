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