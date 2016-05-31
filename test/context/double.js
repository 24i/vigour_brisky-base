'use strict'
const test = require('tape')
const Base = require('../../')

test('context - double - override (noContext property)', function (t) {
  const b = new Base({
    val: 'b',
    key: 'B',
    nestB: 'nestB',
    noReference: true
  })
  const c = new Base({ cA: { cB: new b.Constructor() } })
  const d = new c.Constructor()
  t.same(d.cA.cB.nestB.path(), [ 'cA', 'cB', 'nestB' ], 'double context has correct path')
  d.cA.cB.nestB.set('resolve d!')
  t.equal(d.cA.cB.nestB === b.nestB, false, 'resolved double context')
  const e = new c.Constructor()
  e.set({ cA: { cB: { nestB: 'resolve e!' } } })
  t.equal(e.cA.cB.nestB === b.nestB, false, 'resolved double context using deep set')
  const f = new c.Constructor()
  f.cA.cB.set({ nestB: null })
  t.equal(f.cA.cB.nestB === b.nestB, false, 'resolved double context using remove')
  t.equal(f.cA.cB.nestB, null, 'removed nestB')
  t.same(f.cA.cB.keys(), [], 'remove results in empty keys')
  const g = new c.Constructor()
  g.cA.cB.nestB.set('nestB')
  t.equal(g.cA.cB.nestB === g.nestB, false, 'does resolve if its the same (creates its own)')
  t.end()
})

test('storeContext and applyContent', function (t) {
  const b = new Base({
    val: 'b',
    key: 'B',
    nestB: 'nestB',
    noReference: true
  })

  const c = new Base({ cA: { cB: new b.Constructor() } })
  const d = new c.Constructor()

  const base = d.cA.cB.nestB
  const store = base.storeContext()

  b.nestB.set('testVal')
  c.cA.cB.nestB.set('testVal2')

  base.applyContext(store)

  base.set('A!')

  t.equal(d.cA.cB.nestB.val, 'A!', 'applied context')

  base.applyContext(store)
  base.set('B!')

  t.equal(d.cA.cB.nestB.compute(), 'B!', 'applied context again')

  t.end()
})