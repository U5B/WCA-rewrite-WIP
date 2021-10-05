const log = require('../../../util/log.js')
module.exports = {
  name: 'spawn',
  once: true,
  async execute (droid) {
    droid.chat('/locraw')
    // droid.setControlState('sprint', true)
    // droid.setControlState('jump', true)
    // droid.setControlState('forward', true)
  }
}
