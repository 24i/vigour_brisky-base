'use strict'
const Base = require('../../')
const test = require('vigour-performance')
var amount = 3e3

// function createBase () {
//   for (let i = 0; i < amount; i++) {
//     const a = new Base(i) //eslint-disable-line
//   }
// }

// function createBaseKeys () {
//   for (let i = 0; i < amount; i++) {
//     const a = new Base({ a: i }) //eslint-disable-line
//   }
// }

// // test(createBaseKeys, createBase, 10)

// function setKeys () {
//   const a = new Base({ a: 100, b: 100 })
//   const b = new a.Constructor({ key: 'ITS B' })
//   for (let i = 0; i < amount; i++) {
//     b.set({ [i]: 1 })
//   }
// }

// // test(setKeys, createBaseKeys, 5)
// function removeKeys () {
//   const a = new Base({ a: 100, b: 100 })
//   const b = new a.Constructor({ key: 'ITS B' })
//   for (let i = 0; i < amount; i++) {
//     b.set({ [i]: 1 })
//   }
//   for (let i = 0; i < amount; i++) {
//     b[i].remove()
//   }
// }

// // test(removeKeys, setKeys, 3, 20)

// function orderedKeysBest () {
//   const b = new Base({
//     sort: 'order'
//   })
//   for (let i = 0; i < amount; i++) {
//     b.set({
//       [i]: {
//         order: i
//       }
//     })
//   }
// }

// // test(orderedKeysBest, setKeys, 1.5)

// function orderedKeysWorst () {
//   const b = new Base({
//     sort: 'order'
//   })
//   for (let i = 0; i < amount; i++) {
//     b.set({
//       [i]: {
//         order: amount - i
//       }
//     })
//   }
// }

// // test(orderedKeysWorst, setKeys, 7.5)

function setKeysRandom () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' })
  b.keys()
  for (let i = 0; i < amount; i++) {
    b.set({ [i % 5 ? i + 'e' : i]: ~~(Math.random() * amount) })
  }
}

function orderedKeysRandom () {
  const b = new Base({
    sort: 'order'
  })
  b.keys()
  for (let i = 0; i < amount; i++) {
    b.set({
      [i % 5 ? i + 'e' : i]: {
        order: ~~(Math.random() * amount)
      }
    })
  }
}

function orderedKeysRandomFilter () {
  const b = new Base({
    sort: 'order',
    escape_bla: { order: 2e3 },
    define: {
      filter (key) {
        return !/escape/.test(key)
      }
    },
    '1escape': { order: 20 },
    '200escape': { order: 1e3 },
    '30escape': { order: 30 },
    _escape: { order: 5e2 }
  })
  b.keys()
  for (let i = 0; i < amount; i++) {
    b.set({
      [i % 5 ? i + 'e' : i]: {
        order: ~~(Math.random() * amount)
      }
    })
  }
}

function orderedManyEscaped () {
  const b = new Base({
    sort: 'order',
    e_bla: { order: 2e3 },
    define: {
      filter (key) {
        return /e/.test(key)
      }
    },
    '1e': { order: 20 },
    '200e': { order: 1e3 },
    '30e': { order: 30 },
    _e: { order: 5e2 }
  })
  b.keys()
  for (let i = 0; i < amount; i++) {
    b.set({
      [i % 5 ? i + 'e' : i]: {
        order: ~~(Math.random() * amount)
      }
    })
  }
}

// test(orderedKeysRandom, setKeysRandom, 2.5)
// test(orderedKeysRandomFilter, orderedKeysRandom, 1.5)
// test(orderedManyEscaped, orderedKeysRandomFilter, 1.25)


const base = new Base({
  sort: 'order'
})
base.keys()
for (let i = 0; i < amount; i++) {
  base.set({
    [i]: {
      order: ~~(Math.random() * amount)
    }
  })
}
const update = require('../../lib/keys/sort/update')
// module.exports = function update (target, field, keys, parent) {

function updateSort () {
  for (let i = 0; i < amount; i++) {
    base[i].order.set(~~(Math.random() * amount))
    update(base[i], 'order')
  }
}

test(updateSort, setKeysRandom, 2.5)
