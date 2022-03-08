const { initDroid, returnDroid } = require('../../../droid/droid.js')
const { discord } = require('../../discord.js')

const regex = require('../../../util/regex.js')
const worldRegex = regex.regexCreate(regex.group.world)

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
    },
    {
      name: 'lobby',
      description: 'run away',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'world',
          description: 'world',
          type: 'STRING',
          required: true
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
    const subCommand = interaction.options.getSubcommand()
    switch (subCommand) {
      case 'start': {
        const options = {
          host: interaction.options.getString('host'),
          port: interaction.options.getInteger('port'),
          version: interaction.options.getString('version')
        }
        interaction.editReply({ content: `Starting bot with host: ${options.host}; port: ${options.port}, version: ${options.version}`, ephemeral: true })
        const response = await initDroid(true, options)
        if (response.message) {
          interaction.editReply({ content: `Startup Error: ${response.stack}`, ephemeral: true })
        } else {
          interaction.editReply({ content: `Successfully started bot with host: ${options.host}; port: ${options.port}, version: ${options.version}`, ephemeral: true })
        }
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
      case 'lobby': {
        const world = interaction.options.get('world').value
        if (world && !worldRegex.test(world)) return
        interaction.editReply(`going to lobby: ${world}`)
        const droid = await returnDroid()
        droid.wca.lobby(0, world)
        break
      }
      default: {
        interaction.editReply('how')
        break
      }
    }
  }
}
