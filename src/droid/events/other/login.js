const log = require('../../../util/log.js')

module.exports = {
  name: 'login',
  once: true,
  async execute (droid) {
    log.log('loggedIn')
  }
}
