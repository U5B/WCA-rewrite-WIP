const { discord } = require('../../../discord/discord.js')
const regex = require('../../../util/regex.js')
const log = require('../../../util/log.js')

module.exports = {
  name: 'bombBell',
  regex: regex.bomb.bell,
  enabled: true,
  once: false,
  parse: true,
  async execute (droid, matches, raw) {
    log.info('uwu')
    const [, username, bomb, world] = matches
    const championUsername = await droid.wca.champion(raw, username)
    await discord.wca.logBomb(championUsername.username, bomb, world)
  }
}