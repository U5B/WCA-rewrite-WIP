
const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')

const bombData = require('../../data/bomb.json')

// THIS SHOULD NEVER BE CALLED EXCEPT FOR ON STARTUP
// Takes a bit of time to execute (3s)
module.exports = {
  name: 'populateBomb',
  enabled: true,
  async execute (client, env, world) {
    const col = env.collection('bomb')
    const bombArrayMongo = []
    const bombDb = await col.find({}).toArray() // fetch world data
    for (const [world, bomb] of Object.entries(bombData.bombs)) {
      let bombObject = {
        _id: world,
        'Combat XP': bomb['Combat XP'],
        Dungeon: bomb.Dungeon,
        Loot: bomb.Loot,
        'Profession Speed': bomb['Profession Speed'],
        'Profession XP': bomb['Profession XP']
      }
      for (const document of bombDb) {
        if (document._id === bombObject._id) bombObject = document
      }
      if (await verify.verifyObject(dataSchema.Bomb, bombObject) === false) continue
      else bombArrayMongo.push(bombObject)
    }
    for (const object of bombArrayMongo) {
      await col.replaceOne({ _id: object._id }, object, { upsert: true })
    }
  }
}
