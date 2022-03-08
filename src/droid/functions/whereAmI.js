const { discord } = require('../../discord/discord.js')
const log = require('../../util/log.js')

let lastLocation = ''
module.exports = {
  name: 'location',
  enabled: true,
  async execute (droid, input) {
    const location = input ?? droid.wca.val.location
    switch (location) {
      case 'lobby': {
        await discord.wca.setActivity('onLobby')
        break
      }
      case 'world': {
        await discord.wca.setActivity('onWorld')
        break
      }
      case 'class': {
        await discord.wca.setActivity('onClass')
        break
      }
      default: {
        await discord.wca.setActivity('onBlackBox')
        break
      }
    }

    if (lastLocation !== location) log.info(`[DROID] location set as ${location}`)
    droid.wca.val.location = location
    lastLocation = location
  }
}
