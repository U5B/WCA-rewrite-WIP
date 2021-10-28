module.exports = {}
const mineflayer = require('mineflayer')
const protocol = require('minecraft-protocol')
const ChatMessage = require('prismarine-chat')('1.16')

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
    logPing(response)
    if (start === true) startDroid(options)
  } catch (error) {
    response = error
    log.error(error)
  }
  return response
}

async function logPing (ping) {
  const description = new ChatMessage(ping.description)
  const version = JSON.stringify(ping.version)
  const players = JSON.stringify(ping.players)
  log.info(description.toString())
  log.info(`${version} || ${players}`)
}

let droid

async function startDroid (options) {
  delete require.cache[require.resolve('./events/events.js')]
  const { bindEvents } = require('./events/events.js')
  if (droid) await droid.end()
  droid = mineflayer.createBot(options)
  bindEvents(droid)
}

async function returnDroid () {
  return droid
}

module.exports = { returnDroid, initDroid }
