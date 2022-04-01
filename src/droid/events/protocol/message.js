const log = require('../../../util/log.js')

module.exports = {
  name: 'message',
  enabled: true,
  once: false,
  async execute (droid, jsonMsg, messagepos) {
    if (messagepos !== 'game_info') {
      droid.wca.champion(jsonMsg)
      await log.chatAnsi(jsonMsg.toAnsi())
    }
  }
}
