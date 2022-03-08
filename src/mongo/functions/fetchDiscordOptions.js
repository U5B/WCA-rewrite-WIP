const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')
const log = require('../../util/log.js')

module.exports = {
  name: 'fetchDiscordOptions',
  enabled: true,
  async execute (client, env, guild) {
    const col = env.collection('discord')
    let optionsDb
    try {
      optionsDb = await col.findOne({ _id: guild.id })
    } catch (error) {
      log.error(`[MONGODB] ${error}`)
      return false
    }
    if (optionsDb === null) {
      optionsDb = {
        _id: guild.id,
        name: guild.name,
        owner: guild.ownerId,
        channels: {
          status: false,
          bomb: false,
          'Combat XP': false,
          Dungeon: false,
          Loot: false,
          'Profession Speed': false,
          'Profession XP': false
        },
        roles: {
          bomb: false,
          'Combat XP': false,
          Dungeon: false,
          Loot: false,
          'Profession Speed': false,
          'Profession XP': false
        },
        msgs: {
          hub: '🚫 **Connected to hub!**',
          firstConnect: '☑️ **Connected to wynncraft.**',
          worldConnect: '✅ **Connected!**',
          reconnect: '🔄 **Reconnecting...**',
          kick: '⚠️ **Kicked.**',
          start: '🆕 **Starting WCA.**',
          stop: '🛑 **Stopping WCA.**',
          resourcePack: '🔂 **Loading Resource Pack...**',
          prefix: 'wca!',
          bomb: false,
          'Combat XP': false,
          Dungeon: false,
          Loot: false,
          'Profession Speed': false,
          'Profession XP': false
        },
        emojis: {
          no: '🚫',
          yes2: '☑️',
          yes: '✅',
          stop: '🛑',
          warn: '⚠️',
          new: '🆕',
          retry2: '🔂',
          retry: '',
          bomb: '💣',
          'Combat XP': false,
          Dungeon: false,
          Loot: false,
          'Profession Speed': false,
          'Profession XP': false
        },
        users: {}
      }
    }
    if (await verify.verifyObject(discordSchema.Guild, optionsDb) === false) return false
    await col.replaceOne({ _id: guild.id }, optionsDb, { upsert: true })
    return optionsDb
  }
}
