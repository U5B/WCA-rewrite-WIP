const { returnDroid } = require('../../droid.js')
module.exports = {
  name: 'afk',
  regex: /(\* U5B_ is now AFK\.|You are no longer AFK)/,
  enabled: false,
  once: false,
  parse: false,
  async execute (matches) {
    const droid = await returnDroid()
    await droid.chat('/essentials:afk')
  }
}
