const log = require('../../util/log.js')

module.exports = {
  name: 'ready',
  async execute (client) {
    await log.info('[DISCORD] Connected to Discord. (READY)')
  }
}
