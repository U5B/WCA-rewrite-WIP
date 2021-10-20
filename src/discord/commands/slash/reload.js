const { client } = require('../../discord.js')

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
      id: client.application.owner.id,
      type: 'USER',
      permission: true
    }
  ],
  extra: {},
  async execute (client, interaction, args) {
    const state = interaction.options.get('deploy').value
    delete require.cache[require.resolve('../../deploy.js')]
    const { reloadRegularCommands, reloadSlashCommands } = require('../../deploy.js')
    await reloadRegularCommands()
    if (state === true) {
      await reloadSlashCommands(true)
    } else {
      await reloadSlashCommands()
    }
    await interaction.editReply('commands have been reloaded')
  }
}
