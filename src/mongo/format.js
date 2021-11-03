const XRegExp = require('xregexp')
const log = require('../util/log.js')
const regex = require('../util/regex.js')
const { SealedModel } = require('./extra/sealed.js')

// need to figure out what the schema is going to look like

const Player = new SealedModel({
  _id: new XRegExp(regex.group.uuid4),
  username: new XRegExp(regex.group.username),
  nickname: new XRegExp(regex.group.nickname)
})

const discordGuild = new SealedModel({
  _id: /[0-9]{17,18}/,
  name: String,
  prefix: String,
  channels: [Object],
  messages: [Object],
  roles: [Object]
})

const discordUser = new SealedModel({
  _id: /[0-9]{17,18}/
})

const droidOptions = new SealedModel({
  host: String,
  port: Number,
  version: String,
  brand: String,
  viewDistance: String
})

const test = {
  discord: {
    guild: {
      default: {
        id: '000000000000000000',
        prefix: 'w!',
        channels: {},
        messages: {},
        roles: {},
        emoji: {}
      }
    },
    user: {
      default: {
        id: '000000000000000000'
      }
    }
  },
  droid: {
    options: {
      host: '95.111.249.143',
      port: 10000,
      version: '1.16.5',
      brand: 'vanilla',
      viewDistance: 'tiny'
    }
  },
  data: {
    bombs: {},
    servers: {}
  }
}
