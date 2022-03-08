const log = require('../../util/log.js')
module.exports = {
  name: 'deleteToMultipleServers',
  enabled: true,
  async execute (_, msgIds) {
    for (const value of msgIds) {
      try {
        await value.delete()
      } catch (error) {
        log.error(error)
        await value.delete()
      }
    }
  }
}
