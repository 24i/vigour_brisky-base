'use strict'
const test = require('brisky-performance')
const createBase = require('../..')
const amount = 1e6

const Observable = require('vigour-observable')

const bstamp = require('brisky-stamp')

console.log('perf benchmarks start', amount / 1000 + 'k')

// how to regocnise is something is a reference ? array
// whats the fingerprint
// for now jsut dont support arrays?
// meh

// so all methods that need to be able to get extended are
// 1: remove, render, set -- nothing else is extendable

// what are the charecteristcs?
// ------------------------------------------------------------
const compute = () => {
 // support key
}

const emit = () => {

}

const type = () => {

}

const keys = () => {
  // this is so much faster just take out the props

}

const remove = () => {
  // this is so much faster just take out the props

}

const on = [
  {
    child: true
  },
  void 0,
  void 0,
  void 0,
  true
]

// const EventEmitter = require('events')

// do the same trick for property optmization of base
const property = (target, key, val, stamp) => {
  // key

  if (key === 'on') {
    // so this one has a custom set -- thats fine thats just properties
    // simple if index then -->

    // keys what to do with it? -- important for state speed

    // maybe make it faster for 1 as well
    const result = [{}]
    for (let i in val[key]) {
      result.push(val[key][i])
      result[0][key] = result.length - 1
    }
    return result
    // return create(on, val[key], stamp, target)
  } else {
    const child = target.child || (target.child = get(target, 'child', true))
    if (child === true) {
      if (!target[0]._keys) {
        target[0]._keys = []
      }
      target[0]._keys.push(val[key])
      return target[0]._keys.length - 1
    } else {
      return create(child, val[key], stamp, target)
    }
  }
}

const isReference = (val) => {
  while (val[1] && val.length > 3) {
    if (val[0].type) {
      return true
    } else {
      val = val[1]
    }
  }
}

// similair to set key internal sort of same handeling

const set = (target, val, stamp, isNew) => {
  var changed
  // need to check for change
  if (!stamp) {
    const type = typeof val
    if (type === 'object' && type !== 'function') {
      if (val.length && isReference(val)) {
        console.log('IS REF')
      } else {
        const compare = !isNew && target[0]
        if (!compare) {
          changed = true
          for (let i in val) {
            // not rly new also something to take care of
            // console.log('GO GO', i, val[i])
            val[i] = property(target, i, val, stamp)
          }
        } else {
          for (let i in val) {
            if (compare[i]) {
              // need to take care of prop as well! else cant change
              // needs to be a set function the prop defintion
              // also needs property here!
              if (set(compare[i], val[i], stamp)) {
                changed = true
              }
            } else {
              changed = true
              val[i] = property(target, i, val, stamp)
            }
          }
        }
      }
    } else {
      const t = target[0]
      if (typeof t === 'object') {
        t.val = val
      } else {
        if (target[0] !== val) {
          target[0] = val
          changed = true
        }
      }
    }
  } else {
    const t = target[0]
    const on = t.on
    // t.val = val
    if (on) {
      for (let i = 1, len = on.length; i < len; i++) {
        on[i](target, stamp)
      }
    }
  }
  return changed
}

const get = (target, key, context) => {
  // need to do more -- need to know its an object
  if (target[0] && (key in target[0])) {
    return target[0][key]
  } else if (target[1]) {
    const result = get(target[1], key, target)
    if (!context && result) {
      result._k = key
      result._c = target
    }
    return result
  }
}

const create = (target, val, stamp, parent, noInstances) => {
  // find a way to not allways need stamps for , for exmaple listeners
  // properties in val or in the array?
  const t = [ val, target, parent, stamp ]
  if (val !== void 0) { set(t, val, stamp, true) }
  if (noInstances) { t[4] = true }
  if (!target[4] || target[4] !== true) {
    target.push(t)
  }
  return t
}

const turbo = {
  type: 'base'
}
const base = [
  turbo,
  void 0,
  void 0,
  void 0,
  true
]
turbo.child = base

// ------------------------------------------------------------
// test(ultraGet, baseGet, 1)

function createItTurboTripple() {
  var x = create(base, { x: true }, void 0, void 0, void 0, true)
  for (let i = 0; i < amount; i++) {
    let a = create(x)
    let bx = create(a)
    let cxxx = create(bx)
  }
}

var truboSmoots = create(base, { x: true })
var truboSmoots1 = create(truboSmoots, { x: true })
var truboSmoots2 = create(truboSmoots1, { x: true })
function createTurboSingleInheritance () {
  for (let i = 0; i < amount; i++) {
    let b = create(truboSmoots2, { x: i })
  }
}

function createTurboSingle () {
  for (let i = 0; i < amount; i++) {
    let b = create(base, { x: i })
  }
}

function baseMake () {
  for (let i = 0; i < amount; i++) {
    var x = createBase({ z: i })
  }
}

let xb = createBase({ z: true })
let xc = new xb.Constructor()
let xd = new xc.Constructor()
let Con = xd.Constructor
function baseMakeInheritance () {
  for (let i = 0; i < amount; i++) {
    var x = new Con({ z: i })
  }
}

let b = createBase({ z: true })
let c = new b.Constructor()
let d = new c.Constructor()
function getBase () {
  for (let i = 0; i < amount; i++) {
    // so how do we want to treat primitives?
    // prob need to make the array for everything
    d.z
  }
}

var xx = create(base, { x: true, blurfi: true }, void 0, void 0, void 0, true)
var y = create(xx)
var z = create(y)
function getTurbo () {
  for (let i = 0; i < amount; i++) {
    get(z, 'x')
  }
}


function turboListener () {
  for (let i = 0; i < amount; i++) {
    var x = create(base, {
      on: { data: (target, stamp, previous) => {} }
    })
  }
}

function observable () {
  for (let i = 0; i < amount; i++) {
    var x = new Observable({
      on: {
        data (val, stamp) {}
      }
    })
  }
}

var cnt = 0
var obs = 0

var x = create(base, {
  on: {
    1: (target, stamp) => ++cnt
    // 2: (target, stamp) => ++cnt
  }
})

function emitTurboListener () {
  for (let i = 0; i < amount; i++) {
    let s = bstamp.create()
    set(x, i, s)
    bstamp.close(s)
  }
}

var y = new Observable({
  on: {
    data: (val, stamp) => { ++obs }
  }
})

function emitObservable () {
  for (let i = 0; i < amount; i++) {
    y.set(i)
  }
}

// 10k 700
test(createTurboSingleInheritance, baseMakeInheritance, 1, 1)

// test(createTurboSingle, baseMake, 1, 10)

// test(createItTurboTripple, baseMake, 2, 10)

// test(getTurbo, getBase, 1, 10)

//  ⨯ 64.9 ms is smaller then 48.3 ms
// test(turboListener, observable, 1, 10)

// test(emitTurboListener, emitObservable, 1, 1)

setTimeout(() => {
  console.log(cnt, obs)
}, 2e3)

// function object () {
//   for (let i = 0; i < amount; i++) {
//     // so how do we want to treat primitives?
//     // prob need to make the array for everything
//     let b = { x: i }
//   }
// }

// function getObject () {
//   let b = { x: 0 }
//   for (let i = 0; i < amount; i++) {
//     // so how do we want to treat primitives?
//     // prob need to make the array for everything
//     b[i]
//   }
// }
