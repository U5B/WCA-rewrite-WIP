const { discord } = require('../../../discord/discord.js')
const regex = require('../../../util/regex.js')

module.exports = {
  name: 'bombBell',
  regex: [regex.bomb.bell],
  enabled: true,
  once: false,
  parse: false,
  matchAll: false,
  async execute (droid, username, bomb, world) {
    await discord.wca.logBomb(username, bomb, world)
  }
}
