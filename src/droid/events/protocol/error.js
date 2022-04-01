const log = require('../../../util/log.js')

module.exports = {
  name: 'error',
  enabled: true,
  once: false,
  async execute (droid, error) {
    await log.error(error)
  }
}
