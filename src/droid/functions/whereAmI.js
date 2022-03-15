const { discord } = require('../../discord/discord.js')
const log = require('../../util/log.js')

let lastLocation = ''
module.exports = {
  name: 'location',
  enabled: true,
  async execute (droid, input, string) {
    const location = input ?? droid.wca.val.location
    if (lastLocation === location) return
    droid.wca.val.location = location
    lastLocation = location
    log.info(`[DROID] location set as ${location}`)
    switch (location) {
      case 'lobby': {
        await discord.wca.sendStatus('hub', string)
        await discord.wca.setActivity('onLobby')
        break
      }
      case 'world': {
        await discord.wca.sendStatus('worldConnect', string)
        await discord.wca.setActivity('onWorld')
        break
      }
      case 'class': {
        await discord.wca.sendStatus('class', string)
        await discord.wca.setActivity('onClass')
        break
      }
      case 'reconnect': {
        await discord.wca.sendStatus('reconnect', string)
        await discord.wca.setActivity('onBlackBox')
        break
      }
      case 'switch': {
        await discord.wca.sendStatus('switch', string)
        await discord.wca.setActivity('onBlackBox')
        break
      }
      case 'resourcePack': {
        await discord.wca.sendStatus('resourcePack', string)
        await discord.wca.setActivity('onClass')
        break
      }
      default: {
        await discord.wca.sendStatus('error', string)
        await discord.wca.setActivity('onBlackBox')
        break
      }
    }
  }
}
