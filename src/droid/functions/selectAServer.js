const ChatMessage = require('prismarine-chat')('1.16')

const log = require('../../util/log.js')
const servers = require('../../util/api/servers.js')

const worldRecommendRegex = /^World (\d{1,3}) \(Recommended\)$/
const worldRegex = /^World (\d{1,3})$/

let selectedWorld = 'WC0'
let recommendedWorld = 'WC0'
module.exports = {
  name: 'selectAServer',
  enabled: true,
  once: false,
  async execute (droid, window) {
    await selectAServer(droid, window)
  }
}

async function selectAServer (droid) {
  const api = await servers.fetchServersCached() // fetch servers

  const overrideWorld = droid.wca.val.overrideWorld // force-select our world (if possible)
  if (overrideWorld) {
    api[overrideWorld] = { firstSeen: Date.now(), players: ['bot', 'bot2'] }
    droid.wca.val.ignoredWorlds = droid.wca.val.ignoredWorlds.filter(world => world !== overrideWorld)
  }
  const optimalWorlds = await servers.getOptimalWorlds(api)

  let check = true
  let found = false
  let cycle = false

  let nextPage = null
  let previousPage = null

  while (check === true) {
    await droid.waitForTicks(20)
    const currentWindow = droid.currentWindow
    const result = await checkWorld(optimalWorlds, currentWindow)
    if (!result) {
      check = false
      found = false
      continue
    }
    let slot = await result.get('optimal')
    nextPage = await result.get('nextPage')
    previousPage = await result.get('previousPage')
    if (!slot && nextPage && cycle === false) {
      console.log('next page')
      slot = nextPage
    } else if (!slot && !nextPage && previousPage && cycle === false) {
      console.log('previous page')
      cycle = true
      slot = previousPage
    } else if (!slot && previousPage && cycle === true) {
      console.log('previous page')
      slot = previousPage
    } else if (!slot && !previousPage && cycle === true) {
      console.log('page 1')
      cycle = false
      console.log(optimalWorlds[0])
      delete optimalWorlds[0]
      continue
    } else if (slot) {
      log.info(`[DROID] Selected World ${selectedWorld}`)
      found = true
      check = false
    } else {
      log.error('[DROID] Could not find optimal world')
      found = false
      check = false
    }
    if (slot) droid.clickWindow(slot, 0, 0)
  }
  if (found === false && check === false) {
    log.info(`[DROID] Selected recommended ${recommendedWorld}`)
    await droid.waitForTicks(10)
    droid.clickWindow(13, 0, 0)
  }
}

async function checkWorld (optimalWorlds, window) {
  const worlds = await fetchServerInventory(window)
  for (const world of optimalWorlds) {
    const slot = worlds.get(world[0])
    if (slot === undefined) continue
    if (slot) {
      selectedWorld = world[0]
      return worlds.set('optimal', slot)
    }
  }
  return worlds
}

async function fetchServerInventory (window) {
  const worlds = new Map()
  const allowed = ['lime_terracotta', 'yellow_terracotta', 'red_terracotta']
  const items = window.slots ?? window.containerItems() // why does containerItems sometimes not exist why
  for (const item of items) {
    if (!item) continue
    if (item.name === 'diamond_block') {
      const name = await new ChatMessage(JSON.parse(item.customName)).toString().trim()
      if (!worldRecommendRegex.test(name)) continue
      const [, WC] = worldRecommendRegex.exec(name)
      worlds.set(`WC${WC}`, item.slot)
      recommendedWorld = `WC${WC}`
      continue
    }
    if (item.name === 'arrow') {
      const name = await new ChatMessage(JSON.parse(item.customName)).toString().trim()
      let regex = /Page (\d) >>>>>/
      if (regex.test(name)) {
        // const [, pageNumber] = regex.exec(name)
        worlds.set('nextPage', item.slot)
      }
      regex = /Page (\d) <<<<</
      if (regex.test(name)) {
        // const [, pageNumber] = regex.exec(name)
        worlds.set('previousPage', item.slot)
      }
      continue
    }
    if (allowed.includes(item.name)) {
      const name = await new ChatMessage(JSON.parse(item.customName)).toString().trim()
      if (!worldRegex.test(name)) continue
      const [, WC] = worldRegex.exec(name)
      worlds.set(`WC${WC}`, item.slot)
      continue
    }
  }
  return worlds
}
