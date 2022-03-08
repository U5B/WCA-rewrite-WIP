const { discord } = require('../../discord.js')
const { mongo } = require('../../../mongo/mongo.js')
module.exports = {
  name: 'configure',
  description: 'configure various stuff about the bot',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'role',
      description: 'configure specific role',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'name',
          description: 'name of channel to input',
          type: 'STRING',
          required: false
        },
        {
          name: 'id',
          description: 'role id',
          type: 'ROLE',
          required: false
        }
      ]
    },
    {
      name: 'channel',
      description: 'configure specific channel',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'name',
          description: 'name of channel to input',
          type: 'STRING',
          required: false
        },
        {
          name: 'id',
          description: 'channel id',
          type: 'CHANNEL',
          required: false
        }
      ]
    },
    {
      name: 'msg',
      description: 'configure preset messages / format / prefix',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'name',
          description: 'name of message to input',
          type: 'STRING',
          required: false
        },
        {
          name: 'string',
          description: 'message to replace with',
          type: 'STRING',
          required: false
        }
      ]
    },
    {
      name: 'options',
      description: 'configure default options',
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
    const guildId = interaction.guildId
    const stringRegex = /\w+/
    switch (subCommand) {
      case 'role': {
        const options = {
          name: interaction.options.getString('name'),
          role: interaction.options.getRole('id')
        }
        options.id = options.role.id
        if (!options.name || !options.id) return interaction.editReply('fail')
        if ((stringRegex.test(options.name) || stringRegex.test(options.id)) === false) return interaction.editReply('fail')
        await mongo.wca.configureDiscordRole(guildId, options.id, options.name)
        interaction.editReply('E')
        break
      }
      case 'channel': {
        const options = {
          name: interaction.options.getString('name'),
          channel: interaction.options.getChannel('id')
        }
        options.id = options.channel.id
        if (!options.name || !options.id) return interaction.editReply('fail')
        if ((stringRegex.test(options.name) || stringRegex.test(options.id)) === false) return interaction.editReply('fail')
        await mongo.wca.configureDiscordChannel(guildId, options.id, options.name)
        interaction.editReply('E')
        break
      }
      case 'msg': {
        const options = {
          name: interaction.options.getString('name'),
          msg: interaction.options.getString('string')
        }
        if (!options.name || !options.msg) return interaction.editReply('fail')
        if ((stringRegex.test(options.name) || stringRegex.test(options.msg)) === false) return interaction.editReply('fail')
        await mongo.wca.configureDiscordMessage(guildId, options.msg, options.name)
        interaction.editReply('E')
        break
      }
      case 'options': { // todo add options funny
        const options = {
          host: interaction.options.getString('host'),
          version: interaction.options.getString('version'),
          port: interaction.options.getInteger('port')
        }
        if (!options.host || !options.version || !options.port) return interaction.editReply('fail')
        await mongo.wca.configureDroidOptions(options.host, options.port, options.version)
        interaction.editReply('E')
        break
      }
      default: {
        interaction.editReply('how')
        break
      }
    }
  }
}
