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
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'host',
          description: 'ip or hostname',
          type: 'STRING',
          required: false
        },
        {
          name: 'port',
          description: 'port',
          type: 'INTEGER',
          required: false
        },
        {
          name: 'version',
          description: 'version',
          type: 'STRING',
          required: false
        }
      ]
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
        const options = {
          host: interaction.options.getString('host'),
          port: interaction.options.getInteger('port'),
          version: interaction.options.getString('version')
        }
        interaction.editReply({ content: `started bot with host: ${options.host}; port: ${options.port}, version: ${options.version}`, ephemeral: true })
        await initDroid(true, options)
        break
      }
      case 'stop': {
        interaction.editReply('stopped a bot')
        const droid = await returnDroid()
        droid.end()
        break
      }
      case 'say': {
        const string = interaction.options.get('text').value
        interaction.editReply(`said ${string}`)
        const droid = await returnDroid()
        droid.chat(string)
        break
      }
      default: {
        interaction.editReply('how')
        break
      }
    }
  }
}
