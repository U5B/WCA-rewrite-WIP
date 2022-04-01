const { returnDroid } = require('../../droid.js')
module.exports = {
  name: 'tpyes2',
  regex: /↑ » The player ([0-9a-zA-Z_]) wants to teleport you to them!/,
  enabled: true,
  once: false,
  parse: true,
  async execute () {
    const droid = await returnDroid()
    await droid.chat('/essentials:tpyes')
  }
}
