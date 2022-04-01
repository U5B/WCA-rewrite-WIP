const log = require('../../util/log.js')

module.exports = {
  name: 'interactionCreate',
  async execute (client, interaction) {
    if (interaction.isCommand()) {
      // defer the reply as soon as possible
      await interaction.deferReply({ content: 'Please wait...', ephemeral: true })
      await log.info(`[DISCORD] ${interaction.user.tag} executed ${interaction.commandName} in ${interaction.guild.name}.`)

      try {
        // check if we actually have a command with that name
        const command = client.wca.slashCommands.get(interaction.commandName)
        if (!command) return interaction.editReply({ content: 'Unknown command. Please reload slash commands.', ephemeral: true })

        // execute the command
        await command.execute(client, interaction)
      } catch (error) {
        await log.error(error)
        return interaction.followUp({ content: `There was an error while executing this command! Error: ${error}`, ephemeral: true })
      }
    }
  }
}
