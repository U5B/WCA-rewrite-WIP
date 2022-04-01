
const log = require('../util/log.js')

const verify = {}
verify.verifyObjects = async function (Schema, values) {
  try {
    for (const value of Object.values(values)) {
      Schema(value)
    }
    return true
  } catch (error) {
    await log.error(error)
    return false
  }
}

verify.verifyObject = async function (Schema, value) {
  try {
    Schema(value)
    return true
  } catch (error) {
    await log.error(error)
    return false
  }
}

module.exports = verify
