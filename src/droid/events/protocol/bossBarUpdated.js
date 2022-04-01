const ChatMessage = require('prismarine-chat')('1.16')

const log = require('../../../util/log.js')
const regex = require('../../../util/misc/regex.js')

const bombRegex = regex.bomb.bossBar
module.exports = {
  name: 'bossBarUpdated',
  enabled: true,
  once: false,
  async execute (droid, bossBar) {
    const string = bossBar.title.toString().trim()
    if (bombRegex.test(string)) {
      const [, , , duration] = bombRegex.exec(string)
      await droid.wca.lobby(duration)
    }
  }
}
