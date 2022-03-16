const { discord } = require('../../discord.js')

module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'me',
      description: 'ping me',
      type: 'SUB_COMMAND'
    },
    {
      name: 'you',
      description: 'ping you',
      type: 'SUB_COMMAND'
    },
    {
      name: 'someone',
      description: 'ping someone else',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'uwu',
          description: 'ping someone',
          type: 'MENTIONABLE'
        }
      ]
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
    if (await interaction.options.getSubcommand() === 'me') {
      await interaction.followUp(`<@${client.user.id}>`)
    } else if (await interaction.options.getSubcommand() === 'you') {
      await interaction.followUp(`<@${interaction.user.id}> oh no oh lol`)
    } else if (await interaction.options.getSubcommand() === 'someone') {
      const user = await interaction.options.getMentionable('uwu')
      if (user) await interaction.followUp(`<@${user.id}> nowo lowo`)
    }
  }
}
