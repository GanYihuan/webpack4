import $ from 'jquery'

// module.exports = 'a------'

class B {
}

function * gen(params) {
  yield 1
}
console.log(gen().next())