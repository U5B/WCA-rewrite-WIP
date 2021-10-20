const { initDroid, returnDroid } = require('../../../droid/droid.js')
const { client } = require('../../discord.js')
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
    },
    {
      name: 'say',
      description: 'say something',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'text',
          description: 'text',
          type: 'STRING',
          required: true
        }
      ]
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
      case 'say': {
        const string = interaction.options.get('text').value
        interaction.followUp(`said ${string}`)
        const droid = await returnDroid()
        droid.chat(string)
        break
      }
      default: {
        interaction.followUp('how')
        break
      }
    }
  }
}
