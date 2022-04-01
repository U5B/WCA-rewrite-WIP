module.exports = {}
const mineflayer = require('mineflayer')
const protocol = require('minecraft-protocol')
const fs = require('fs')
const path = require('path')

const { mongo } = require('../mongo/mongo.js')
const log = require('../util/log.js')
const utils = require('../util/misc/utils.js')
const { discord } = require('../discord/discord.js')

let previousOptions
async function initDroid (start, options) {
  const config = await mongo.wca.fetchDroidOptions()
  if (!options) options = previousOptions
  options = await utils.compareObjects(options, config)
  const mineflayerOptions = options
  previousOptions = options
  options.onMsaCode = async function onMsaCode (response) {
    await log.error(response)
    await log.error(response.message)
  }
  let response
  try {
    // ignore await error, hasn't updated typings yet
    await log.info(`[DROID] pinging server ${mineflayerOptions.host}:${mineflayerOptions.port} on ${mineflayerOptions.version}`)
    response = await protocol.ping({ host: mineflayerOptions.host, port: mineflayerOptions.port, version: mineflayerOptions.version })
    if (start === true) await startDroid(mineflayerOptions)
  } catch (error) {
    response = error
    await log.error(`[DROID] failed to ping/join server ${mineflayerOptions.host}:${mineflayerOptions.port} on ${mineflayerOptions.version}`)
    await log.error(error)
  }
  return response
}
let droid

async function startDroid (options) {
  delete require.cache[require.resolve('./events/events.js')]
  const { bindEvents } = require('./events/events.js')
  delete require.cache[require.resolve('./events/chat.js')]
  const { chat, reloadChat } = require('./events/chat.js')
  if (droid) endDroid()
  await log.log('[DROID] Starting droid...')
  droid = mineflayer.createBot(options) // actually start the bot
  // await once(droid, 'inject_allowed')

  droid.wca = {}
  await log.log('[DROID] Started droid.')
  await bindVariables(droid)
  await bindFunctions(droid)
  await bindEvents(droid) // bind events
  droid.on('message', chat) // bind chat
  await reloadChat(droid)
  await discord.wca.sendStatus('start')
}

async function returnDroid () {
  return droid
}

async function endDroid () {
  await droid.end('wca:end')
  droid = null
}

async function bindVariables (droid) {
  droid.inventory.requiresConfirmation = false

  droid.wca.val = {}
  droid.wca.val.currentWorld = 'WC0'
  droid.wca.val.location = 'lobby'
  droid.wca.val.ignoredWorlds = ['YT', 'TEST']
  droid.wca.val.overrideWorld = null
}

async function bindFunctions (droid) {
  await log.log('[DROID] Binding functions...')
  const functionPath = './functions'
  const functionFolder = fs.readdirSync(path.resolve(__dirname, functionPath)).filter((file) => file.endsWith('.js'))
  for (const file of functionFolder) {
    delete require.cache[require.resolve(`${functionPath}/${file}`)]
    const fun = require(`${functionPath}/${file}`)
    if (fun.enabled === false) continue
    droid.wca[`${fun.name}`] = async function wcaDroidFunction (...args) {
      args.unshift(droid)
      let value
      try {
        value = await fun.execute(...args)
      } catch (e) {
        await log.error(e)
        value = e
      }
      return value
    }
    await log.info(`[DROID] added function droid.wca.${fun.name} from ${file}`)
  }
}

module.exports = { returnDroid, initDroid, endDroid }
