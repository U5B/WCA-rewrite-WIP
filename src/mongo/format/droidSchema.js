const { SealedModel } = require('./SealedModel.js')
const regex = require('../../util/misc/regex.js')
const { Model } = require('objectmodel')
const droidSchema = {}

droidSchema.Player = new SealedModel({
  _id: regex.regexCreate(regex.group.uuid4),
  username: regex.regexCreate(regex.group.username),
  wynnUsername: regex.regexCreate(regex.group.username),
  nickname: regex.regexCreate(regex.group.nickname)
})

droidSchema.Guild = new SealedModel({
  _id: /[a-zA-Z]{3,4}/,
  name: String,
  members: [Array],
  territories: [Array]
})

droidSchema.Options = new Model({
  _id: 'options',
  host: String,
  port: Number,
  version: String
})

module.exports = droidSchema
