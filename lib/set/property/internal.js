'use strict'
/**
 * @function setKeyInternal
 * @memberOf Base#
 * @param  {String} key Key to be set on base
 * @param  {*} [val]
 *   The value that will be set on base[key]
 *   uses .set internaly
 *   checks for .noReference and .type on val to overwrite default behaviour
 * @param  {Stamp} [stamp]
 * @param {nocontext} [boolean] dont resolveContext when true
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @return {Base|undefined} this, if undefined no relevant change happened
 */
exports.setKeyInternal = function (key, val, stamp, nocontext, property, params, p) {
  if (val && typeof val === 'object') {
    if (!val.isBase) {
      if (val.type) {
        val = this.getType(val, stamp, key, void 0, params)
        if (property) {
          property.remove(false)
        }
        if (val) {
          this.addNewProperty(key, val, stamp)
        }
        return this
      }
    } else if (
      val.noReference &&
      (!val._parent || val._parent === this)
    ) {
      this.addNewProperty(key, val, stamp)
      val._parent = this
      val.key = key
      return this
    }
  }
  if (property) {
    if (property._parent !== this) {
      if (val === null) {
        return this.contextRemove(key, stamp)
      } else {
        // 93ms
        const p = '_' + key
        return (this[p] = new (property.getConstructor())(val, stamp, this, void 0, params, true)) //eslint-disable-line
      }
    } else {
      property.set(val, stamp, nocontext)
      return
    }
  } else if (val === null) {
    this[key] = null
    this.resolveKeys()
    return
  } else {
    if (this.child === true) {
      // again us epriv is applicable
      this[key] = val
    } else {
      this.addNewProperty(key, new this.child(val, stamp, this, key, params), stamp) // eslint-disable-line
    }
    return this
  }
}
