const { mongo } = require('../../mongo/mongo.js')
const { discord } = require('../discord.js')
const utils = require('../../util/utils.js')

module.exports = {
  name: 'sendStatus',
  enabled: true,
  async execute (_, status, msg) {
    const channelName = 'status'
    const timePrefix = await utils.discord.time()
    const msgIds = []
    const options = await mongo.db(process.env.mongoDb).collection('discord').find().toArray()
    for (const option of options) {
      if (!option._id || !option.channels[channelName]) continue
      const guildId = option._id
      const channelId = option.channels[channelName]
      const msgPrefix = option.msgs[status] || 'placeholder' // Connected to hub!
      const channel = discord.guilds.cache.get(`${guildId}`).channels.cache.get(`${channelId}`)
      let messageToSend
      if (msg) {
        messageToSend = `${timePrefix} ${msgPrefix} ${msg}`
      } else {
        messageToSend = `${timePrefix} ${msgPrefix}`
      }
      if (channel && messageToSend) {
        const msgId = await channel.send(messageToSend)
        msgIds.push(msgId)
      }
    }
    return msgIds
  }
}
