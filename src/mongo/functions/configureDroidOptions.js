const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')
const log = require('../../util/log.js')

module.exports = {
  name: 'configureDroidOptions',
  enabled: true,
  async execute (client, env, host, port, version) {
    const col = env.collection('droid')
    let optionsDb
    try {
      optionsDb = await col.findOne({ _id: 'options' })
    } catch (error) {
      await log.error(`[MONGODB] ${error}`)
      return false
    }
    optionsDb = {
      _id: 'options',
      host: host,
      port: port,
      version: version
    }
    if (await verify.verifyObject(droidSchema.Options, optionsDb) === false) return false
    await col.replaceOne({ _id: 'options' }, optionsDb, { upsert: true })
    return optionsDb
  }
}
