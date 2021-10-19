const { client } = require('../../discord.js')
const { initDroid, returnDroid } = require('../../../droid/droid.js')
module.exports = {
  name: 'droid',
  description: 'starts or stops a bot',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'start',
      description: 'start droid',
      type: 'SUB_COMMAND'
    },
    {
      name: 'stop',
      description: 'stop droid',
      type: 'SUB_COMMAND'
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
    const subCommand = interaction.options.getSubcommand()
    switch (subCommand) {
      case 'start': {
        interaction.followUp('started a bot')
        initDroid(true)
        break
      }
      case 'stop': {
        interaction.followUp('stopped a bot')
        const droid = await returnDroid()
        droid.end()
        break
      }
      default: {
        interaction.followUp('how')
        break
      }
    }
  }
}
