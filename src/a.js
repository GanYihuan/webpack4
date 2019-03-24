import $ from 'jquery'

console.log($)

// module.exports = 'a------'

class B {
  b = 2
}
let b = new B()
console.log(b.b)

function * gen(params) {
  yield 1
}
console.log(gen().next())
