module.exports = {
  name: 'ready',
  async execute (client) {
    await client.application.fetch()
    const { reloadRegularCommands, reloadSlashCommands } = require('../deploy.js')
    await reloadRegularCommands()
    await reloadSlashCommands(true)
  }
}
