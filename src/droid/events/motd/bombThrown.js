const { discord } = require('../../../discord/discord.js')
const regex = require('../../../util/regex.js')
const log = require('../../../util/log.js')

module.exports = {
  name: 'bombThrown',
  regex: regex.bomb.thrown,
  enabled: true,
  once: false,
  parse: true,
  async execute (droid, matches, raw) {
    log.warn('[DROID] Lobby: bomb thrown')
    await discord.wca.sendToMultipleServers('logBomb', raw.toString())
    const [, username, bomb, world] = matches
    const championUsername = await droid.wca.champion(raw, username)
    const bombObject = await discord.wca.logBomb(championUsername.username, bomb, world)
    const duration = bombObject.bombDuration ?? 10
    await droid.wca.lobby(duration)
  }
}
