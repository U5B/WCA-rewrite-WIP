module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  type: 'CHAT_INPUT',
  permissions: [],
  options: [],

  async execute (client, interaction, args) {
    await interaction.reply('Pong!')
  }
}
