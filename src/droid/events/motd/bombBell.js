const { discord } = require('../../../discord/discord.js')
const regex = require('../../../util/misc/regex.js')
const log = require('../../../util/log.js')
const { returnDroid } = require('../../droid.js')

module.exports = {
  name: 'bombBell',
  regex: regex.bomb.bell,
  enabled: true,
  once: false,
  parse: true,
  async execute (matches, raw) {
    const droid = await returnDroid()
    await discord.wca.sendToMultipleServers('logBomb', raw.toString())
    const [, username, bomb, world] = matches
    const championUsername = await droid.wca.champion(raw, username)
    await discord.wca.logBomb(championUsername.username, bomb, world)
  }
}
