'use strict'
/**
 * @function addNewProperty
 * @memberOf Base#
 * @param {String} key Key to be set on new property
 * @param {*} val The value that will be set on val
 * @param {Event} [event] Current event
 * @return {Base} this
 */
exports.addNewProperty = function (key, val, stamp) {
  if (val.val !== null) {
    this[key] = val
    this.addKey(key, val)
    // this is bad
    if (this._Constructor) {
      // has to be optmized
      this.createContextGetter(key)
    }
  }
}
