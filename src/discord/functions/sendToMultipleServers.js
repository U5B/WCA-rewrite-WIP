const { mongo } = require('../../mongo/mongo.js')
const { discord } = require('../../discord/discord.js')

module.exports = {
  name: 'sendToMultipleServers',
  enabled: true,
  async execute (_, channelName, msg) {
    const msgIds = []
    const options = await mongo.db(process.env.mongoDb).collection('discord').find().toArray()
    for (const option of options) {
      if (!option._id || !option.channels[channelName]) continue
      const guildId = option._id
      const channelId = option.channels[channelName]
      const channel = discord.guilds.cache.get(`${guildId}`).channels.cache.get(`${channelId}`)
      if (channel) {
        const msgId = await channel.send(msg)
        msgIds.push(msgId)
      }
    }
    return msgIds
  }
}
