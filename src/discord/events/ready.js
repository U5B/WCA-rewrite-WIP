const log = require('../../util/log.js')

module.exports = {
  name: 'ready',
  async execute (client) {
    log.info('[DISCORD] Connected to Discord. (READY)')
  }
}
