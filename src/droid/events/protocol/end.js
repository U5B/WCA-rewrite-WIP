const log = require('../../../util/log.js')
const { once } = require('events')

module.exports = {
  name: 'end',
  enabled: true,
  once: false,
  async execute (droid) {
    log.error('[DROID] Disconnected.')
  }
}
