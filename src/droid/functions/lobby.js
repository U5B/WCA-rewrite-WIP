const regex = require('../../util/regex.js')
const util = require('../../util/utils.js')
module.exports = {
  name: 'lobby',
  enabled: true,
  async execute (droid, duration, world) {
    const currentWorld = droid.wca.val.currentWorld
    if (currentWorld !== world && duration && duration > 0) ignoreWorld(droid, duration, currentWorld)

    droid.wca.val.overrideWorld = world ?? null
    await droid.chat('/lobby')
  }
}

async function ignoreWorld (droid, duration, currentWorld) {
  let timeoutDuration = duration ?? 1
  timeoutDuration *= 60000
  droid.wca.val.ignoredWorlds.push(currentWorld)
  await util.sleep(timeoutDuration)
  const index = droid.wca.val.ignoredWorlds.indexOf(currentWorld)
  if (index !== -1) droid.wca.val.ignoredWorlds.splice(index)
}
