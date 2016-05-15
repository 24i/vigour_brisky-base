'use strict'
const test = require('tape')
const Base = require('../../')

test('property - define - primitive', function (t) {
  t.plan(2)
  const a = new Base({
    properties: {
      val: 'hello',
      keepit: 100
    },
    Child: 'Constructor'
  })
  a.set({ b: {} })
  t.equals(a.b.val, 'hello', 'correct val "hello"')
  t.equals(a.b.keepit, 100, 'correct keepit "100"')
})

test('property - define - null', function (t) {
  t.plan(3)
  const a = new Base({
    properties: {
      val: null,
      something: new Base({ field: 'something' })
    },
    Child: 'Constructor'
  })
  const b = new a.Constructor(a)
  b.set({ c: void 0, val: 1 })
  t.equal(b.val instanceof Base, true, 'val is a normal base')
  t.equal(b.c instanceof Base, true, 'field c gets created')
  b.set({
    something: 'hello',
    properties: {
      something: null
    }
  })
  t.equal(b.something, null, 'removes base property')
})

test('property - define - set Child', function (t) {
  t.plan(3)
  const a = new Base({
    properties: new Base('hello')
  })
  a.set({ b: {} })
  t.equals(a.b.val, 'hello', 'b, correct val "hello"')
  const Constructor = function (val) {
    this.val = val
  }
  Constructor.prototype.something = true
  a.b.properties = Constructor
  a.b.set({ c: true })
  t.equals(a.b.c.val, true, 'custom constructor, b.c, correct val "true"')
  t.equals(a.b.c.something, true, 'custom constructor, b.c, has field something')
})

test('property - define - wrong property type error', function (t) {
  t.plan(1)
  try {
    new Base({ properties: { val: void 0 } })
  } catch (e) {
    t.equal(
      e.message,
      'base.properties - uncaught property type val: "undefined"'
    )
  }
})

test('property - define - wrong type on properties', function (t) {
  t.plan(1)
  try {
    new Base({ properties: true })
  } catch (e) {
    t.equal(
      e.message,
      '.properties need to be set with an object'
    )
  }
})
