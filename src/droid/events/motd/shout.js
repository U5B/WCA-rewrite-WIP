const { discord } = require('../../../discord/discord.js')
const regex = require('../../../util/regex.js')
const utils = require('../../../util/utils.js')
const log = require('../../../util/log.js')
module.exports = {
  name: 'shout',
  regex: regex.chat.shout,
  enabled: true,
  once: false,
  parse: false,
  async execute (droid, matches, raw) {
    const rawMessage = raw.toString()
    const time = await utils.discord.time()
    await discord.wca.sendToMultipleServers('shout', `${time} ${rawMessage}`)
  }
}
