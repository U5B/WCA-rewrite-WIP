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
          name: await interaction.options.getString('name'),
          role: await interaction.options.getRole('id')
        }
        options.id = options.role.id
        if (!options.name || !options.id) return await interaction.editReply(`Missing arguments for name or id: ${options.name} || ${options.id}`)
        if ((stringRegex.test(options.name) || stringRegex.test(options.id)) === false) return await interaction.editReply(`Invalid syntax: ${options.name} || ${options.id}`)
        await mongo.wca.configureDiscordRole(guildId, options.id, options.name)
        await interaction.editReply(`${options.name}: ${options.id}`)
        break
      }
      case 'channel': {
        const options = {
          name: await interaction.options.getString('name'),
          channel: await interaction.options.getChannel('id')
        }
        options.id = options.channel.id
        if (!options.name || !options.id) return await interaction.editReply(`Missing arguments for name or id: ${options.name} || ${options.id}`)
        if ((stringRegex.test(options.name) || stringRegex.test(options.id)) === false) return await interaction.editReply(`Invalid syntax: ${options.name} || ${options.id}`)
        await mongo.wca.configureDiscordChannel(guildId, options.id, options.name)
        await interaction.editReply(`${options.name}: ${options.id}`)
        break
      }
      case 'msg': {
        const options = {
          name: await interaction.options.getString('name'),
          msg: await interaction.options.getString('string')
        }
        if (!options.name || !options.msg) return await interaction.editReply(`Missing arguments for name or id: ${options.name} || ${options.msg}`)
        if ((stringRegex.test(options.name) || stringRegex.test(options.msg)) === false) return await interaction.editReply(`Missing arguments for name or id: ${options.name} || ${options.msg}`)
        await mongo.wca.configureDiscordMessage(guildId, options.msg, options.name)
        await interaction.editReply(`${options.name}: ${options.msg}`)
        break
      }
      case 'options': { // todo add options funny
        const options = {
          host: await interaction.options.getString('host'),
          version: await interaction.options.getString('version'),
          port: await interaction.options.getInteger('port')
        }
        if (!options.host || !options.version || !options.port) return await interaction.editReply(`Missing arguments for name or id: ${options.host} || ${options.version} || ${options.port}`)
        await mongo.wca.configureDroidOptions(options.host, options.port, options.version)
        await interaction.editReply(`${options.host}:${options.port} on ${options.version}`)
        break
      }
      default: {
        await interaction.editReply('how')
        break
      }
    }
  }
}
