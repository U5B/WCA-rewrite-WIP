const log = require('../../../util/log.js')

module.exports = {
  name: 'end',
  enabled: true,
  once: false,
  async execute (droid, reason) {
    await droid.wca.onEnd(reason, undefined)
  }
}
