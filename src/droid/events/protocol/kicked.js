const log = require('../../../util/log.js')
const ChatMessage = require('prismarine-chat')

module.exports = {
  name: 'kicked',
  enabled: true,
  once: false,
  async execute (droid, reason, loggedIn) {
    await droid.wca.onEnd(reason, loggedIn)
  }
}
