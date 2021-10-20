const log = require('../../util/log.js')
const { client } = require('../discord.js')
module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (interaction.isCommand()) {
      // defer the reply as soon as possible
      await interaction.deferReply({ content: 'Please wait...', ephemeral: true })
      
      // check if we actually have a command with that name
      const command = client.slashCommands.get(interaction.commandName)
      if (!command) return interaction.editReply({ content: 'Unknown command. Please reload slash commands.', ephemeral: true })
      
      // execute the command
      try {
        await command.execute(client, interaction)
      } catch (error) {
        log.error(error)
        return interaction.followUp({ content: `There was an error while executing this command! Error: ${error}`, ephemeral: true })
      }
    }
  }
}
