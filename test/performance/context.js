'use strict'
const base = require('../..')
const test = require('brisky-performance')
var amount = 1e4

function setKeys () {
  const a = base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' })
  for (let i = 0; i < amount; i++) {
    b.set({ [i]: 1 })
  }
}

// we could make this fast by only using get every then there is an abstract interface which will make
// everything  ultra optmized with context (no trees but just hashes of paths)
function setKeysContext () {
  const a = base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' }) //eslint-disable-line
  for (let i = 0; i < amount; i++) {
    // much better stratgy is to set it straight on the correct field vs doing weird context getter shit later
    a.set({ [i]: 1 })
    // updates keys in b and creates context getters (slow)
  }
}

function createConstructors () {
  let a = base({ a: { b: 100 } })  //eslint-disable-line
  for (let i = 0; i < amount; i++) {
    // this is all resolve
    let b = new a.Constructor({ a: { b: true } }) //eslint-disable-line
  }
}

function createConstructorsAndResolve () {
  // let a = base({ b: 100 })  //eslint-disable-line
  for (let i = 0; i < amount; i++) {
    let a = base({ b: true })
    // let x = a.getConstructor()
    // let y = a.b.getConstructor()
    // creating the actual constructor is just rly slow
    // new x()
    // new y(i)
    let b = new a.Constructor() //eslint-disable-line
  }
}

test(setKeysContext, setKeys, 1)

test(createConstructors, function () {
  let a = base({ b: 100 })  //eslint-disable-line
  for (let i = 0; i < amount; i++) {
    let b = base({ a: { b: true } }) //eslint-disable-line
  }
}, 1)

test(createConstructorsAndResolve, () => {
  // var obj = base({ x: true }).prototype
  for (let i = 0; i < amount; i++) {
    let B = function () {}
    B.prototype = { x: true }
    let c = new B() //eslint-disable-line
  }
}, 1)
