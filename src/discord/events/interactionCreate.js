const log = require('../../util/log.js')
const { client } = require('../discord.js')
module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (interaction.isCommand()) {
      await interaction.deferReply({ content: 'Please wait...', ephemeral: false })

      const command = client.slashCommands.get(interaction.commandName)
      if (!command) return interaction.followUp({ content: 'Unknown command? An error has occured.' })

      try {
        await command.execute(client, interaction)
      } catch (error) {
        log.error(error)
        return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
      }
    }
  }
}
