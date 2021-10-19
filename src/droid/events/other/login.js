const log = require('../../../util/log.js')
const { once } = require('events')

module.exports = {
  name: 'login',
  once: true,
  async execute (droid) {
    await once(droid._client, 'update_time')
    droid.chat('/locraw')
  }
}
