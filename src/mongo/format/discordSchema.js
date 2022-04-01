const { SealedModel } = require('./SealedModel.js')
const { ArrayModel, Model, ObjectModel, Any } = require('objectmodel')

const discordSchema = {}

discordSchema.Guild = new Model({
  _id: /[0-9]{17,18}/,
  name: String,
  owner: /[0-9]{17,18}/,
  channels: Any,
  roles: Any,
  msgs: Any,
  emojis: Any,
  users: Any
})

discordSchema.User = new SealedModel({
  _id: /[0-9]{17,18}/
})

module.exports = discordSchema
