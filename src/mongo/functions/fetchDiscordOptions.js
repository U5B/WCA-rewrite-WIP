const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')
const log = require('../../util/log.js')
const utils = require('../../util/misc/utils.js')

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
    const defaultOptions = {
      _id: guild.id,
      name: guild.name,
      owner: guild.ownerId,
      channels: {
        fallback: '',
        shout: '',
        status: '',
        bomb: '',
        logBomb: '',
        chatRaw: '',
        'Combat XP': '',
        Dungeon: '',
        Loot: '',
        'Profession Speed': '',
        'Profession XP': ''
      },
      roles: {
        bomb: '',
        'Combat XP': '',
        Dungeon: '',
        Loot: '',
        'Profession Speed': '',
        'Profession XP': ''
      },
      msgs: {
        hub: '🚫 **Connected to hub!**',
        firstConnect: '☑️ **Connected to wynncraft.**',
        worldConnect: '✅ **Connected!**',
        reconnect: '🔄 **Reconnecting...**',
        switch: '🔄 **Switching...**',
        kick: '⚠️ **Kicked.**',
        start: '🆕 **Starting WCA.**',
        stop: '🛑 **Stopping WCA.**',
        stopProcess: `<@${guild.ownerId}> 🔥🛑🔥 **PROCESS IS DYING!!!!!!!!!**`,
        resourcePack: '🔂 **Loading Resource Pack...**',
        error: '🔥 **ERROR!** EVERYTHING IS BURNING',
        class: '🔂 **Selecting a Class...**',
        prefix: 'wca!',
        bomb: '',
        'Combat XP': '',
        Dungeon: '',
        Loot: '',
        'Profession Speed': '',
        'Profession XP': ''
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
        'Combat XP': '',
        Dungeon: '',
        Loot: '',
        'Profession Speed': '',
        'Profession XP': ''
      },
      users: {
        owner: guild.ownerId
      }
    }

    if (optionsDb === null) {
      optionsDb = defaultOptions
    } else { // funky function to check for missing entries
      optionsDb = await utils.compareObjects(optionsDb, defaultOptions)
    }
    if (await verify.verifyObject(discordSchema.Guild, optionsDb) === false) return false
    await col.replaceOne({ _id: guild.id }, optionsDb, { upsert: true })
    return optionsDb
  }
}
