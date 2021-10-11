module.exports = {
  name: 'ready',
  async execute () {
    const { reloadRegularCommands, reloadSlashCommands } = require('../deploy.js')
    await reloadRegularCommands()
    await reloadSlashCommands(true)
  }
}
