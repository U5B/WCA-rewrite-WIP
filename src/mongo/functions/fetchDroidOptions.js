const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')
const log = require('../../util/log.js')
const utils = require('../../util/misc/utils.js')

module.exports = {
  name: 'fetchDroidOptions',
  enabled: true,
  async execute (client, env) {
    const col = env.collection('droid')
    let optionsDb
    try {
      optionsDb = await col.findOne({ _id: 'options' })
    } catch (error) {
      await log.error(`[MONGODB] ${error}`)
      return false
    }
    const defaultOptions = {
      _id: 'options',
      host: 'lobby.wynncraft.com',
      port: 25565,
      version: '1.16.5',
      viewDistance: 2,
      username: process.env.mcUsername,
      profilesFolder: './config/',
      auth: 'microsoft',
      brand: 'vanilla',
      checkTimeoutInterval: 20 * 1000,
      hideErrors: false,
      logErrors: true,
      defaultChatPatterns: false
    }
    if (optionsDb === null) {
      optionsDb = defaultOptions
    } else {
      optionsDb = await utils.compareObjects(optionsDb, defaultOptions)
    }
    if (await verify.verifyObject(droidSchema.Options, optionsDb) === false) return false
    await col.replaceOne({ _id: 'options' }, optionsDb, { upsert: true })
    return optionsDb
  }
}
