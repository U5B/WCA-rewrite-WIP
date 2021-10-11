const log = require('../../../util/log.js')
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
      id: '222170304577929218',
      type: 'USER',
      permission: true
    }
  ],
  extra: {},
  async execute (client, interaction, args) {
    if (interaction.options.getSubcommand() === 'start') {
      interaction.followUp('started a bot')
    } else if (interaction.options.getSubcommand() === 'stop') {
      interaction.followUp('stopped a bot')
    }
  }
}
