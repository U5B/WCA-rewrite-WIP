const { discord } = require('../../discord.js')

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
      id: discord.application.owner.id,
      type: 'USER',
      permission: true
    }
  ],
  extra: {},
  async execute (client, interaction, args) {
    const state = interaction.options.get('deploy').value
    delete require.cache[require.resolve('../../deploy.js')]
    const { reloadRegularCommands, reloadSlashCommands, reloadFunctions } = require('../../deploy.js')
    await reloadFunctions()
    await reloadRegularCommands()
    if (state === true) {
      await reloadSlashCommands(true)
    } else {
      await reloadSlashCommands()
    }
    await interaction.editReply('commands have been reloaded')
  }
}
