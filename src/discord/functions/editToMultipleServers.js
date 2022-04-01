const log = require('../../util/log.js')

module.exports = {
  name: 'editToMultipleServers',
  enabled: true,
  async execute (_, msgIds, msg) {
    for (const value of msgIds) {
      try {
        await value.edit(msg)
      } catch (error) {
        await log.error(error)
        await value.edit(msg)
      }
    }
  }
}
