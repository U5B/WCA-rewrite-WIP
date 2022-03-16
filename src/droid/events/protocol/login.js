const utils = require('../../../util/misc/utils.js')
const log = require('../../../util/log.js')
const server = require('../../../util/api/servers.js')
const { discord } = require('../../../discord/discord.js')

let starting = true
module.exports = {
  name: 'login',
  enabled: true,
  once: true,
  async execute (droid) {
    await log.log('[DROID] Logged in.')
    if (starting) {
      await discord.wca.sendStatus('firstConnect')
      discord.wca.droidRetryAttempts = 0
      starting = false
    }
    server.startInterval()
  }
}
