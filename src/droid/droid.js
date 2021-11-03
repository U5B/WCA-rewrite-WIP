module.exports = {}
const mineflayer = require('mineflayer')
const protocol = require('minecraft-protocol')
const ChatMessage = require('prismarine-chat')('1.16')
const constants = require('./constants.js')

const log = require('../util/log.js')

async function initDroid (start, discordOptions) {
  delete require.cache[require.resolve('../config/droid.json')]
  const config = require('../config/droid.json')
  const options = {
    username: process.env.mcEmail ?? process.env.mcUsername,
    host: discordOptions.host ?? config.host,
    port: discordOptions.port ?? config.port,
    version: discordOptions.version ?? config.version,
    brand: config.brand,
    viewDistance: config.viewDistance,
    checkTimeoutInterval: 20 * 1000,
    hideErrors: false,
    logErrors: true,
    defaultChatPatterns: false
  }
  if (process.env.mcEmail && process.env.mcPassword) {
    options.password = process.env.mcPassword
  }
  let response
  try {
    // ignore await error, hasn't updated typings yet
    response = await protocol.ping({ host: options.host, port: options.port, version: options.version })
    if (start === true) startDroid(options)
  } catch (error) {
    response = error
    log.error(error)
  }
  return response
}
let droid

async function startDroid (options) {
  delete require.cache[require.resolve('./events/events.js')]
  const { bindEvents } = require('./events/events.js')
  if (droid) await droid.end()
  try {
    log.log('[DROID] Starting droid...')
    droid = mineflayer.createBot(options) // actually start the bot
    log.log('[DROID] Started droid.')
    constants.started = true
    bindEvents(droid) // bind events
  } catch (error) {
    constants.started = false
    log.error(error)
  }
}

async function returnDroid () {
  return droid
}

module.exports = { returnDroid, initDroid }
