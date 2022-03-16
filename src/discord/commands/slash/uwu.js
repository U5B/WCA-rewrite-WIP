const { discord } = require('../../discord.js')

module.exports = {
  name: 'uwu',
  description: 'owo?!',
  type: 'CHAT_INPUT',
  defaultPermission: false,
  permissions: [
    {
      id: discord.application.owner.id,
      type: 'USER',
      permission: true
    }
  ],
  extra: {},
  async execute (client, interaction, args) {
    const uwu = await client.wca.sendToMultipleServers('test', 'owo')
    await client.wca.deleteToMultipleServers(uwu)
    await interaction.followUp(`<@${client.user.id}>`)
  }
}
