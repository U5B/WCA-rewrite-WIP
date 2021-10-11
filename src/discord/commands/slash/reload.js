module.exports = {
  name: 'reload',
  description: 'reload slash commands',
  type: 'CHAT_INPUT',
  options: [],
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
    await interaction.followUp('reloading commands')
    const { reloadRegularCommands, reloadSlashCommands } = require('../../deploy.js')
    await reloadRegularCommands()
    await reloadSlashCommands()
    await interaction.editReply('commands have been reloaded')
  }
}
