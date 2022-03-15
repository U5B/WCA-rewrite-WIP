const regex = require('../../util/regex.js')
const util = require('../../util/utils.js')
const server = require('../../util/api/servers.js')
const { discord } = require('../../discord/discord.js')
const { once } = require('events')
let switchCheck = true // used to check if switch works
module.exports = {
  name: 'lobby',
  enabled: true,
  async execute (droid, duration, world) {
    const currentWorld = droid.wca.val.currentWorld
    if (currentWorld !== world) await ignoreWorld(droid, currentWorld, duration)
    try {
      if (switchCheck) switchCheck = await switchWorld(droid, world) // enable switching
    } catch {
      switchCheck = false
    }
    if (switchCheck) {
      await droid.wca.location('switch')
      return
    }

    droid.wca.val.overrideWorld = world ?? null
    await droid.chat('/lobby')
  }
}

async function switchWorld (droid, world) {
  if (!world) {
    const optimalWorlds = await server.getOptimalWorlds()
    world = optimalWorlds[0][0]
  }
  if (typeof world !== 'string') {
    console.log(world)
    return false
  }
  await droid.chat(`/switch ${world}`)
  await util.promiseTimeout(once(droid, 'login'), 1500)
  return true
}

async function ignoreWorld (droid, currentWorld = 'WC0', duration = 1) {
  duration *= 60000
  droid.wca.val.ignoredWorlds.push(currentWorld)
  unIgnoreWorld(droid, duration, currentWorld)
}
async function unIgnoreWorld (droid, duration, currentWorld) {
  await util.sleep(duration)
  const index = droid.wca.val.ignoredWorlds.indexOf(currentWorld)
  if (index !== -1) droid.wca.val.ignoredWorlds.splice(index)
}
