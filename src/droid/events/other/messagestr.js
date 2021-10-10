const log = require('../../../util/log.js')

module.exports = {
  name: 'messagestr',
  once: false,
  async execute (droid, messagestr, messagepos, jsonmsg) {
    log.chat(jsonmsg.toAnsi())
  }
}
