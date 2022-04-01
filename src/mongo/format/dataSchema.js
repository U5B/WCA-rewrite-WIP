const { SealedModel } = require('./SealedModel.js')
const { ArrayModel, Model, ObjectModel, Any } = require('objectmodel')
const XRegExp = require('xregexp')
const regex = require('../../util/misc/regex.js')
const dataSchema = {}

dataSchema.Bomb = new SealedModel({
  _id: new XRegExp(regex.group.world),
  'Combat XP': Number,
  Dungeon: Number,
  Loot: Number,
  'Profession Speed': Number,
  'Profession XP': Number
})

dataSchema.Territory = new SealedModel({
  name: String,
  guild: {
    name: String,
    tag: String
  },
  production: {
    emes: Number,
    ores: Number,
    wood: Number,
    crop: Number
  },
  storage: {
    emes: {
      current: Number,
      max: Number,
      trend: Number
    },
    ores: {
      current: Number,
      max: Number,
      trend: Number
    },
    wood: {
      current: Number,
      max: Number,
      trend: Number
    },
    crop: {
      current: Number,
      max: Number,
      trend: Number
    }
  },
  treasury: String,
  defences: String,
  adjacents: ArrayModel([String]),
  hq: Boolean
})

dataSchema.Territories = new Model({
  _id: 'territories',
  lastUpdated: String,
  territories: Any
})

dataSchema.PreviousTerritories = new Model({
  _id: 'previousTerritories',
  lastUpdated: String,
  territories: Any
})

module.exports = dataSchema
