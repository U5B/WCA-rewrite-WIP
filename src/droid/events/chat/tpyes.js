const { returnDroid } = require('../../droid.js')
module.exports = {
  name: 'tpyes',
  regex: /([0-9a-zA-Z_]{1,16}) has requested (?:that you|to) teleport to (?:you|them)\./,
  enabled: false,
  once: false,
  parse: true,
  async execute () {
    const droid = await returnDroid()
    await droid.chat('/essentials:tpyes')
  }
}
