const log = require('../../../util/log.js')
module.exports = {
  name: 'help',
  description: 'help me',
  type: 'CHAT_INPUT',
  options: [],
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
    const commands = client.slashCommands.get()
    log.error(commands)
  }
}
