const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')
const log = require('../../util/log.js')

module.exports = {
  name: 'fetchDroidOptions',
  enabled: true,
  async execute (client, env) {
    const col = env.collection('droid')
    let optionsDb
    try {
      optionsDb = await col.findOne({ _id: 'options' })
    } catch (error) {
      log.error(`[MONGODB] ${error}`)
      return false
    }
    if (optionsDb === null) {
      optionsDb = {
        _id: 'options',
        host: 'lobby.wynncraft.com',
        port: 25565,
        version: '1.16.5',
        viewDistance: 2
      }
    }
    if (await verify.verifyObject(droidSchema.Options, optionsDb) === false) return false
    await col.replaceOne({ _id: 'options' }, optionsDb, { upsert: true })
    return optionsDb
  }
}
