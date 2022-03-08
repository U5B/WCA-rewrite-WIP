const utils = require('../../../util/utils.js')
const log = require('../../../util/log.js')
const server = require('../../../util/api/servers.js')
module.exports = {
  name: 'login',
  enabled: true,
  once: false,
  async execute (droid) {
    server.startInterval()
    await log.log('[DROID] Logged in.')
  }
}
