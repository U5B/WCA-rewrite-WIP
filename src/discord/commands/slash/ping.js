module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  type: 'CHAT_INPUT',
  options: [
    {
      type: 'MENTIONABLE',
      name: 'user',
      description: 'mention a user '
    }
  ],
  defaultPermission: false,
  permissions: [
    {
      id: '222170304577929218',
      type: 'USER',
      permission: true
    }
  ],
  extra: {},
  async execute (client, interaction, args) {
    await interaction.followUp('uwu')
  }
}
