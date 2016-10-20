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
    let c = new b.Constructor()
  }
}

// test(setKeysContext, setKeys, 1)

// test(createConstructors, function () {
//   let a = base({ b: 100 })  //eslint-disable-line
//   for (let i = 0; i < amount; i++) {
//     let b = base({ a: { b: true } }) //eslint-disable-line
//   }
// }, 1)

// test(createConstructorsAndResolve, () => {
//   // var obj = base({ x: true }).prototype
//   for (let i = 0; i < amount; i++) {
//     let B = function () {}
//     B.prototype = { x: true }
//     let c = new B() //eslint-disable-line
//   }
// }, 1)

/*
b = [ {
  z: true
  a: [ {  [ b, a.b ]: { c: [  { val: true }, a.a.b.c  ] } }, a.a ]
 },  a]

  // alternative
  // what about memoization after first retrival?

*/

const ultra = {
  _i: false,
  key (target, key, context) {
    if (key in target) {
      return target[key]
    } else if (target._) {
      // context
      const result = this.key(target._, key, true)
      // may need the path or something -- for inherted things
      // try to remove the double context
      if (!context) {
        if (result) {
          result._c = target
          result._k = key
        }
        // memoization -- needs to use instances if you want to update from a base
        target[key] = result // maybe on another spot
      }

      return result
    }
  },
  method (target, key, a, b, c, d, e, f, g) {
    const result = ultra.key(target, key)
    if (result) {
      if (typeof result === 'function') {
        return (target, a, b, c, d, e, f, g)
      } else {
        return result
      }
    }
  },
  // so all methods that need to be able to get extended are
  // 1: remove, render, set -- nothing else is extendable
  set (target, val) {
    for (let key in val) {
      // property check ofc
      // if target[key] // need to get heavy operation

      if (key !== '_i') {
        target[key] = { val: val[key] }
      } else {
        target[key] = val[key]
      }
    }
  },
  new (target, val) {
    // this means it can become faster
    // if (typeof val === 'object') {
    //   // reuse?
    //   var obj = val
    // }
    var obj = {}
    if (val) { ultra.key(target, 'set')(obj, val) }
    if (target) {
      if (target._i !== false) {
        if (!target._i) { target._i = [] }
        target._i.push(obj)
      }
      obj._ = target
    }
    return obj
  }
}

var a = ultra.new(ultra, {
  x: true
})
var b = ultra.new(a, { y: true, _i: false })
var c = ultra.new(b, { y: 'bla' })

// console.log(c)
// 4x faster


function ultramake () {
  for (let i = 0; i < amount; i++) {
    // much better stratgy is to set it straight on the correct field vs doing weird context getter shit later
    // a.set({ [i]: 1 })
    // ultra.new(false, { x: true })
    var c = ultra.key(b, 'new')(b, { z: true }) // ultra.new()
    // var x = ultra.key('x')
    // updates keys in b and creates context getters (slow)
  }
}

var X = base({ x: true }).Constructor
var Bla = new X({ y: true, instances: false }).Constructor
var y = new Bla({ z: true })

function baseMake () {
  for (let i = 0; i < amount; i++) {
    var x = new Bla({ z: true })
    // base({ z: true })
  }
}

function ultraGet () {
  for (let i = 0; i < amount; i++) {
    ultra.key(c, 'x')
  }
}

function baseGet () {
  for (let i = 0; i < amount; i++) {
    var x = y.x
  }
}

// const { get } = require('briksy-base')
const get = ultra.method
const create = ultra.new

function ultramakeContext () {
  let a = create(ultra, { z: true, _i: false })
  for (let i = 0; i < amount; i++) {
    let b = create(a)
    let c = create(b)
  }
}

var turbo = [
  {
    new (target, val, instances) {
      // may need more keys
      const t = [ val, target ]
      if (instances) { t[2] = true }
      if (!target[2] || target[2] !== true) { target.push(t) }
      return t
    },
    get (target, key, context) {
      if (target[0] && (key in target[0])) {
        return target[0][key]
      } else if (target[1]) {
        const result = getTurbo(target[1], key, target)
        if (!context && result) {
          result._k = key
          result._c = target
        }
        return result
      }
    }
  },
  false,
  true
]

var createTurbo = turbo[0].new

// test(ultraGet, baseGet, 1)

function createItTurbo() {
  var x = createTurbo(turbo, { x: true }, true)
  for (let i = 0; i < amount; i++) {
    let a = createTurbo(x)
    let b = createTurbo(a)
    let c = createTurbo(b)
  }
}

var truboSmoots = createTurbo(turbo, { x: true }, true)

function createTurboSingle() {
  for (let i = 0; i < amount; i++) {
    let b = createTurbo(truboSmoots, { x: true })
  }
}

var xx = createTurbo(turbo, { x: { val: true }, blurfi: true }, true)
var y = createTurbo(xx)
var z = createTurbo(y)

var getTurbo = turbo[0].get
    // console.warn(z)

function getTurbox() {
  for (let i = 0; i < amount; i++) {
    getTurbo(z, 'x')
  }
}


// 10k 700
test(createItTurbo, ultramakeContext, 1)

test(getTurbox, ultraGet, 1)

test(createItTurbo, baseMake, 1)

test(createItTurbo, createConstructorsAndResolve, 1)

// setTimeout(() => {
//   console.log(Object.keys(list))
// }, 100)