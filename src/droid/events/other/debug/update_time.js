const log = require('../../../../util/log')

module.exports = {
  name: 'update_time',
  once: false,
  async execute (droid) {
    log.chat('update_time')
  }
}
