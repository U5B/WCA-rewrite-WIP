const log = require('../../../../util/log')

module.exports = {
  name: 'update_time',
  enabled: true,
  once: false,
  async execute (droid) {
    await droid.wca.updateLocation()
  }
}
