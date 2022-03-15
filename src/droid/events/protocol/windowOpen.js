const ChatMessage = require('prismarine-chat')('1.16')

const log = require('../../../util/log.js')

module.exports = {
  name: 'windowOpen',
  enabled: true,
  once: false,
  async execute (droid, window) {
    window.requiresConfirmation = false
    const windowTitle = await new ChatMessage(await JSON.parse(window.title)).toString().trim()
    await droid.waitForTicks(20)
    switch (windowTitle) {
      case 'Wynncraft Servers': {
        await droid.wca.selectAServer(window)
        break
      }
      case 'Select a Class': {
        await droid.wca.selectAClass(window)
        break
      }
      default: {
        log.error(`[DROID] Invalid Inventory Window: ${windowTitle}`)
        log.error(window)
        droid.closeWindow()
        break
      }
    }
  }
}
