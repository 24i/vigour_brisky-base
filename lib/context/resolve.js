'use strict'
/**
 * @function resolveContext
 * resolves context on set
 * creates instances up to the point where a set within context is performed
 * @memberOf Base#
 * @param {*} val set value to be resolved
 * @param {stamp} stamp current stamp
 * @param {base} context resolve this context
 * @param {boolean} alwaysreturn when set to true always returns resolved base
 * @type {base|undefined}
 */

module.exports = function (val, stamp, context, target, path) {
  var i = this._cLevel
  const level = i
  if (!context) {
    context = this.__c
  }
  if (!target) { target = this }
  var iterator = target

  // if level is 1 && ! context.__c
  // do opt

  if (!path) {
    // this is a waste can be combined with walker
    path = createPath(path, iterator, i)

    // console.log(path, iterator.key)
    // path = p
  }

  if (context.__c) {
    // this is hte hardest case ofcourse
    let cpath = createPath(false, context, context._cLevel)
    // this concat is understandable but lets try to remove the while noitaion of this stuff
    context = context.resolveContext(val, stamp, context.__c, target, cpath.concat(path))
    return context
  }

  let len = path.length
  let end = len - 1

  // ok problem is needs to walk from the top to do setKeyInternal
  // creating all these arrays is ofc a problem

  for (i = 0; i < len; i++) {
    if (context) {
      let segment = path[i]
      let key = '_' + segment
      let prop = context[key]
      // let set
      if (i === end) {
        if (val === null) {
          context.contextRemove(segment)
        } else {
          context = context[key] = new prop.Constructor(val, stamp, context, segment)
        }
      } else {
        context = context[key] = new prop.Constructor(void 0, stamp, context, segment)
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
