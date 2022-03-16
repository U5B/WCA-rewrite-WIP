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

  let response
  try {
    // ignore await error, hasn't updated typings yet
    log.info(`[DROID] pinging server ${mineflayerOptions.host}:${mineflayerOptions.port} on ${mineflayerOptions.version}`)
    response = await protocol.ping({ host: mineflayerOptions.host, port: mineflayerOptions.port, version: mineflayerOptions.version })
    if (start === true) startDroid(mineflayerOptions)
  } catch (error) {
    response = error
    log.error(`[DROID] failed to ping server ${mineflayerOptions.host}:${mineflayerOptions.port} on ${mineflayerOptions.version}`)
    log.error(error)
  }
  return response
}
let droid

async function startDroid (options) {
  delete require.cache[require.resolve('./events/events.js')]
  const { bindEvents } = require('./events/events.js')
  if (droid) await droid.end('wca:end')
  try {
    log.log('[DROID] Starting droid...')
    droid = mineflayer.createBot(options) // actually start the bot
    // await once(droid, 'inject_allowed')

    droid.wca = {}
    log.log('[DROID] Started droid.')
    await bindVariables(droid)
    await bindFunctions(droid)
    await bindEvents(droid) // bind events
    await discord.wca.sendStatus('start')
  } catch (error) {
    log.error('[DROID] Error when starting...')
    log.error(error)
    return error
  }
}

async function returnDroid () {
  return droid
}
async function bindVariables (droid) {
  droid.inventory.requiresConfirmation = false

  droid.wca.val = {}
  droid.wca.val.territories = {}
  droid.wca.val.currentWorld = 'WC0'
  droid.wca.val.location = 'lobby'
  droid.wca.val.ignoredWorlds = ['YT', 'TEST']
  droid.wca.val.overrideWorld = null
}

async function bindFunctions (droid) {
  log.log('[DROID] Binding functions...')
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
        log.error(e)
        value = e
      }
      return value
    }
    log.info(`[DROID] added function droid.wca.${fun.name} from ${file}`)
  }
}

module.exports = { returnDroid, initDroid }
