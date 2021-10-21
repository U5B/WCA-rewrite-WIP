const log = require('../../../util/log.js')

module.exports = {
  name: 'messagestr',
  enabled: true,
  once: false,
  async execute (droid, messagestr, messagepos, jsonmsg) {
    if (messagepos !== 'game_info') log.chat(jsonmsg.toMotd())
  }
}
