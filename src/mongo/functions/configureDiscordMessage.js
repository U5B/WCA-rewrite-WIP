const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')
const log = require('../../util/log.js')

module.exports = {
  name: 'configureDiscordMessage',
  enabled: true,
  async execute (client, env, guildId, channelMessage, optionName) {
    const col = env.collection('discord')
    let optionsDb
    try {
      optionsDb = await col.findOne({ _id: guildId })
    } catch (error) {
      log.error(`[MONGODB] ${error}`)
      return false
    }
    if (!optionsDb) return false
    optionsDb.msgs[optionName] = channelMessage
    if (await verify.verifyObject(discordSchema.Guild, optionsDb) === false) return false
    await col.replaceOne({ _id: guildId }, optionsDb, { upsert: true })
    return optionsDb
  }
}
