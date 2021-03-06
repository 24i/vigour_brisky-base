'use strict'
const test = require('tape')
const Base = require('../../lib/index.js')

test('property - default', t => {
  const base = new Base({
    properties: { x: true },
    x: 100
  })
  t.equal(base.x, 100, 'x equals 100')
  t.end()
})

test('property - function', t => {
  const base = new Base({
    properties: {
      x (val, stamp) { this.y = val * 10 }
    },
    x: 100
  })
  t.equal(base.y, 1000, 'y equals 1000')
  t.end()
})

test('property - base', t => {
  const y = new Base('y')
  const base = new Base({
    types: { z: 'z' },
    properties: {
      x: 'x',
      y: y,
      z: { type: 'z' },
      base: Base.prototype
    },
    x: {},
    y: {},
    z: { field: 'z' }
  })

  t.equal(
    base.properties.base.base !== Base.prototype,
    true,
    'created instance of Base'
  )
  t.equal(
    base.y instanceof y.Constructor,
    true,
    '.y is instanceof y'
  )
  t.equal(base.y.val, 'y', 'y has correct value')
  t.equal(base.x.val, 'x', 'x has correct value')
  t.equal(
    base.z instanceof base.types.z.Constructor,
    true,
    '.z is instanceof base.types.z'
  )
  t.equal(base.z.val, 'z', 'z has correct value')

  base.set({
    properties: {
      x: { type: 'x' },
      y: true,
      z: 'Z'
    }
  })
  t.equal(base.x, null, '.x is removed by different type')
  t.equal(base.y, null, '.y is removed by type change')
  t.equal(base.z.val, 'Z', '.z is set to Z')

  const instance = new base.Constructor({
    properties: {
      z: {
        val: 'Z-2',
        field: 'yuz'
      }
    }
  })
  t.equal(base.z.val, 'Z', '.z is not influenced by instance')
  t.equal(instance.z.val, 'Z-2', 'instance.z has correct value')
  t.equal(
    instance.properties.z.base instanceof base.properties.z.base.Constructor,
    true,
    'instance.properties.z is instanceof .properties.z'
  )
  t.equal(
    instance.z instanceof instance.properties.z.base.Constructor,
    true,
    'instance.z is instanceof instance.properties.z'
  )
  t.equal(
    instance.z.field.val,
    'yuz',
    'merged field from .z, include set on property (field)'
  )
  t.end()
})

test('property - null', t => {
  const base = new Base({
    properties: {
      x: true,
      y: {},
      val: null
    },
    y: {},
    val: 'haha'
  })
  base.set({ properties: { y: null } })
  t.equal(base.properties.y, null, 'removed property')
  t.equal(base.y, null, 'removed existing instance')
  t.equal(base.val.isBase, true, 'remove al property, val is a base')
  t.end()
})

test('property - override normal field', t => {
  const base = new Base({
    y: { bye: true }
  })
  base.set({ properties: { y: 'hello' } })
  t.equal(base.y.bye.val, true, 'did not replace original')
  t.end()
})
