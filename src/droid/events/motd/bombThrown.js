const { discord } = require('../../../discord/discord.js')
const regex = require('../../../util/regex.js')
const log = require('../../../util/log.js')

module.exports = {
  name: 'bombThrown',
  regex: [regex.bomb.thrown],
  enabled: true,
  once: false,
  parse: false,
  matchAll: false,
  async execute (droid, username, bomb, world) {
    log.warn('[DROID] Lobby: bomb thrown')
    const bombObject = await discord.wca.logBomb(username, bomb, world)
    const duration = bombObject.bombDuration ?? 10
    await droid.wca.lobby(duration)
  }
}
