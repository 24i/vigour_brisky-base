'use strict'
exports.properties = {
  instances: true,
  trackInstances: true
}

exports.instances = false

// needs an overwrite for properties to remap inherited props
exports.define = {
  addToInstances () {
    const from = Object.getPrototypeOf(this)
    if (!from.instances) { from.instances = [] }
    from.instances.push(this)
  },
  removeFromInstances () {
    // try to speed this up
    const from = Object.getPrototypeOf(this)
    var instances = from.instances
    if (instances) {
      let len = instances.length
      for (let i = 0; i < len; i++) {
        if (instances[i] === this) {
          instances.splice(i, 1)
          break
        }
      }
    }
    instances = this.instances
    if (instances) {
      let len = instances.length
      for (let i = 0; i < len; i++) {
        instances[i].remove(false)
        i--
        len--
      }
    }
  }
}
