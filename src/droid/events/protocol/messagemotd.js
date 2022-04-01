const log = require('../../../util/log.js')

module.exports = {
  name: 'messagemotd',
  enabled: true,
  once: false,
  async execute (droid, messagemotd, messagepos, jsonmsg) {
    if (messagepos !== 'game_info') {
      await log.chatMotd(messagemotd)
      await log.chatMotd(jsonmsg.json)
    }
  }
}
