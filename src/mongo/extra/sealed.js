const { ObjectModel } = require('objectmodel')

function SealedModel (def) {
  const model = ObjectModel(def)
  model.sealed = true
  model.extend = () => {
    throw new Error('Sealed models cannot be extended')
  }

  const checkUndeclaredProps = (obj, def, undeclaredProps, path) => {
    Object.keys(obj).forEach(key => {
      const val = obj[key]
      const subpath = path ? path + '.' + key : key
      if (!Object.prototype.hasOwnProperty.call(def, key)) {
        undeclaredProps.push(subpath)
      } else if (
        val &&
        typeof val === 'object' &&
        Object.getPrototypeOf(val) === Object.prototype
      ) {
        checkUndeclaredProps(val, def[key], undeclaredProps, subpath)
      }
    })
  }

  return model.assert(
    function hasNoUndeclaredProps (obj) {
      if (!model.sealed) return true
      const undeclaredProps = []
      checkUndeclaredProps(obj, this.definition, undeclaredProps)
      return undeclaredProps.length === 0 ? true : undeclaredProps
    },
    undeclaredProps => `Undeclared properties in the sealed model definition: ${undeclaredProps}`
  )
};

module.exports = { SealedModel }
