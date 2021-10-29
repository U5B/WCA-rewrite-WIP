const log = require('../../../util/log.js')

module.exports = {
  name: 'kicked',
  enabled: true,
  once: false,
  async execute (droid, reason) {
    log.error(`[DROID] Kicked for: '${error}'`)
  }
}
