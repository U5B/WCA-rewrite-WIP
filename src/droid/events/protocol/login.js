const log = require('../../../util/log.js')
const { once } = require('events')

module.exports = {
  name: 'physicsTick',
  enabled: true,
  once: false,
  async execute (droid) {
    log.error('tick')
  }
}
