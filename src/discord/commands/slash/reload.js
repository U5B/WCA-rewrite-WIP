module.exports = {
  name: 'reload',
  description: 'reload slash commands',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'deploy',
      description: 'if I should deploy the discord commands or not',
      type: 'BOOLEAN',
      required: true
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
    const state = interaction.options.get('deploy')
    await interaction.followUp(`reloading commands | deploy ${state}`)
    const { reloadRegularCommands, reloadSlashCommands } = require('../../deploy.js')
    await reloadRegularCommands()
    if (state === true) await reloadSlashCommands()
    await interaction.editReply('commands have been reloaded')
  }
}
