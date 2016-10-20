'use strict'
/**
 * @function resolveContext
 * resolves context on set
 * creates instances up to the point where a set within context is performed
 * @memberOf Base#
 * @param {*} val set value to be resolved
 * @param {stamp} stamp current stamp
 * @param {params} pass on params for set
 * @param {base} context resolve this context
 * @param {boolean} alwaysreturn when set to true always returns resolved base
 * @type {base|undefined}
 */

module.exports = function (val, stamp, params, context, target, path) {
  var i = this._cLevel
  const level = i
  if (!context) {
    context = this.__c
  }
  if (!target) { target = this }
  var iterator = target

  if (!path) {
    path = createPath(path, iterator, i)
  }

  if (context.__c) {
    // this is hte hardest case ofcourse
    let cpath = createPath(false, context, context._cLevel)
    // this concat is understandable but lets try to remove the while noitaion of this stuff
    context = context.resolveContext(val, stamp, params, context.__c, target, cpath.concat(path))
    return context
  }

  let len = path.length
  let end = len - 1
  for (i = 0; i < len; i++) {
    if (context) {
      let segment = path[i]
      let key = '_' + segment
      if (i === end) {
        if (val === null) {
          context.contextRemove(segment)
        } else {
          context = context[key] = new (context[key].getConstructor())(val, stamp, context, void 0, params, true)
        }
      } else {
        context = context[key] = new (context[key].getConstructor())(void 0, stamp, context, void 0, params, true)
      }
    }
  }
  this.clearContextUp(level)
  return context
}

function createPath (path, iterator, i) {
  path = path || []
  while (i) {
    let key = iterator.key
    path.unshift(key)
    iterator = iterator._parent
    i--
  }
  return path
}
