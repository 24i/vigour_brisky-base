'use strict'
/**
 * @function setKey
 * @memberOf Base#
 * Uses setKeyInternal or flag[key]
 * @param  {String} key
 *   Key set on base using setKeyInternal
 *   Checks if a match is found on Base.flags
 * @param  {*} [val]
 *   The value that will be set on base[key]
 * @param  {Stamp} [stamp] Current event
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @return {Base|undefined} if undefined no change happened
 */

// --------- need to make a desicion here as well ---------
// all-inclusive (but slow)
exports.property = function (key, val, stamp, resolve, nocontext) {
  if (this._re.test(key)) {
    return key
  }
}

// fastest
exports.property = function (key, val, stamp, resolve, nocontext) {
  return this._matchPropertyKeys(key)
}

exports.setKey = function (key, val, stamp, resolve, nocontext) {
  var prop = this.property(key, val, stamp, resolve, nocontext)
  if (prop) {
    return this._properties[prop].call(this, val, stamp, resolve, nocontext, prop)
  } else {
    return this.setKeyInternal(key, val, stamp, nocontext, this[key])
  }
}