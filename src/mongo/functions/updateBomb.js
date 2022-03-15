const verify = require('../verify.js')
const dataSchema = require('../format/dataSchema.js')
const discordSchema = require('../format/discordSchema.js')
const droidSchema = require('../format/droidSchema.js')

const bombData = require('../../data/bomb.json')

module.exports = {
  name: 'updateBomb',
  enabled: true,
  async execute (client, env, world, bomb) {
    const col = env.collection('bomb')
    let bombDb = await col.findOne({ _id: world }) // fetch world data
    if (bombDb === null) {
      if (bombData) bombDb = bombData.bombs[world] || null // use old data
      if (bombDb === null) { // create new data
        bombDb = {
          'Combat XP': 0,
          Dungeon: 0,
          Loot: 0,
          'Profession Speed': 0,
          'Profession XP': 0
        }
      }
      bombDb._id = world
      bombDb[bomb]++
    } else {
      // otherwise edit existing data
      bombDb[bomb]++
    }
    // verify document
    if (await verify.verifyObject(dataSchema.Bomb, bombDb) === false) return false
    // replace document
    await col.replaceOne({ _id: world }, bombDb, { upsert: true })
    return true
  }
}
