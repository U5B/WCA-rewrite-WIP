const { Permissions } = require('discord.js')
module.exports = {
  name: 'ping',
  description: 'Ping',
  perms: {
    client: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL],
    user: [Permissions.FLAGS.SEND_MESSAGES]
  },
  aliases: ['pong'],
  async execute (client, message, args) {
    message.reply({ content: 'ping' })
  }
}
