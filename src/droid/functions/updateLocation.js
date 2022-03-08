const log = require('../../util/log.js')
const regex = require('../../util/regex.js')

const ChatMessage = require('prismarine-chat')('1.16')

module.exports = {
  name: 'updateLocation',
  enabled: true,
  async execute (droid) {
    droid.inventory.requiresConfirmation = false
    let value = false

    value = await checkPlayers(droid)
    if (!value) value = await checkInventory(droid)
  }
}
async function checkPlayers (droid) {
  /* Players to check for (prefixed with \u0000):
  \u0000101 = 'Friends'
  \u0000201 = 'Global [WC0]'
  \u0000301 = 'Party'
  \u0000401 = 'Guild'
  Ranges from \u0000101 to \u0000120
  We check \u0000201 to get the world value.
  */
  const players = Object.values(droid.players)
  for (const player of players) {
    if (player.username === '\u0000201') {
      const name = await new ChatMessage(player.displayName).toString().trim()
      if (name) { // 'Global [WC6]'
        const [, world] = regex.world.global.exec(name)
        droid.wca.val.currentWorld = world
        await droid.wca.location('world')
      } else { // '' (class menu)
        await droid.wca.location('class')
      }
      return true
    }
  }
  return false
}

async function checkInventory (droid) {
  if (droid.currentWindow) return
  const inventory = droid.inventory
  for (const item of inventory.slots) {
    if (item === null) continue
    if (item.name === 'compass' && item.customName) { // Compass Check = Lobby?
      const name = await new ChatMessage(JSON.parse(item.customName)).toString().trim()
      if (name !== 'Quick Connect') continue
      await droid.wca.location('lobby')
      const slotToSelect = inventory.hotbarStart - item.slot
      await droid.setQuickBarSlot(slotToSelect)
      await droid.swingArm()
      return true
    }
  }
  return false
}
