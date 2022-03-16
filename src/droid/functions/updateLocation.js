const log = require('../../util/log.js')
const regex = require('../../util/misc/regex.js')
const server = require('../../util/api/servers.js')

const ChatMessage = require('prismarine-chat')('1.16')

module.exports = {
  name: 'updateLocation',
  enabled: true,
  async execute (droid) {
    let value = false

    value = await checkPlayers(droid)
    if (!value) value = await checkInventory(droid)
    return value
  }
}
async function checkPlayers (droid) {
  let found = false
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
      if (name && regex.world.global.test(name)) { // 'Global [WC6]'
        const [, world] = regex.world.global.exec(name)
        droid.wca.val.currentWorld = world
        await droid.wca.location('world')
        const full = await server.checkServerFull(world)
        if (full) await droid.wca.lobby()
        found = true
        return
      }
    }
  }
  return found
}

async function checkInventory (droid) {
  let found = false
  if (droid.currentWindow) return
  const inventory = droid.inventory
  for (const item of inventory.slots) {
    if (!item) continue
    if (item.name === 'compass' && item.customName) { // Compass Check = Lobby?
      const name = await new ChatMessage(JSON.parse(item.customName)).toString().trim()
      if (name !== 'Quick Connect') continue
      await droid.wca.location('lobby')
      const slotToSelect = inventory.hotbarStart - item.slot
      await droid.setQuickBarSlot(slotToSelect)
      await droid.swingArm()
      found = true
      return
    }
  }
  return found
}
