const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')
const log = require('../../util/log.js')

module.exports = {
  name: 'updateTerritory',
  enabled: true,
  async execute (client, env, territories) {
    const col = env.collection('territory')
    let territoriesDb
    let previousTerritoriesDb
    try { // fetch territories
      territoriesDb = await col.findOne({ _id: 'territories' })
    } catch (error) {
      log.error(`[MONGODB] ${error}`)
    }
    if (!territoriesDb) { // if territories isn't found, try to fetch previousTerritories
      try {
        territoriesDb = await col.findOne({ _id: 'previousTerritories' })
      } catch (error) {
        log.error(`[MONGODB] ${error}`)
        return false
      }
    }
    if (territoriesDb === null && territories) { // otherwise assume that there are no territories in the collection
      territoriesDb = {
        _id: 'territories',
        lastUpdated: Date(),
        territories: territories
      }
      previousTerritoriesDb = {
        _id: 'previousTerritories',
        lastUpdated: Date(),
        territories: territories
      }
    } else if (territoriesDb && territories) { // if there are territories in the collection, update them
      previousTerritoriesDb = {
        _id: 'previousTerritories',
        lastUpdated: territoriesDb.lastUpdated,
        territories: territoriesDb.territories
      }
      territoriesDb = {
        _id: 'territories',
        lastUpdated: Date(),
        territories: territories
      }
    } else if (territoriesDb && !territories) { // if there are territories in the collection
      return territoriesDb.territories
    } else {
      return false
    }
    // verify everything
    if (!territories || !territoriesDb || !previousTerritoriesDb) return false
    if (await verify.verifyObjects(dataSchema.Territory, territories) === false) return false
    if (await verify.verifyObject(dataSchema.Territories, territoriesDb) === false) return false
    if (await verify.verifyObject(dataSchema.PreviousTerritories, previousTerritoriesDb) === false) return false

    // replace the documents
    await col.replaceOne({ _id: 'territories' }, territoriesDb, { upsert: true })
    await col.replaceOne({ _id: 'previousTerritories' }, previousTerritoriesDb, { upsert: true })

    return territoriesDb.territories
  }
}
