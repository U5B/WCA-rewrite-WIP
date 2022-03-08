module.exports = {}
const mineflayer = require('mineflayer')
const protocol = require('minecraft-protocol')
const ChatMessage = require('prismarine-chat')('1.16')
const fs = require('fs')
const path = require('path')

const { mongo } = require('../mongo/mongo.js')
const log = require('../util/log.js')
const utils = require('../util/utils.js')
const { discord } = require('../discord/discord.js')
const regex = require('../util/regex.js')

async function initDroid (start, discordOptions) {
  const config = await mongo.wca.fetchDroidOptions()
  const options = {
    username: process.env.mcEmail ?? process.env.mcUsername,
    host: discordOptions.host ?? config.host,
    port: discordOptions.port ?? config.port,
    version: discordOptions.version ?? config.version,
    brand: 'vanilla',
    viewDistance: 2,
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
    log.info(`[DROID] pinging server ${options.host}:${options.port} on ${options.version}`)
    response = await protocol.ping({ host: options.host, port: options.port, version: options.version })
    if (start === true) startDroid(options)
  } catch (error) {
    response = error
    log.error(`[DROID] failed to ping server ${options.host}:${options.port} on ${options.version}`)
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
    droid.wca = {}
    log.log('[DROID] Started droid.')
    await bindVariables(droid)
    await bindFunctions(droid)
    await bindEvents(droid) // bind events
    // await discord.wca.sendStatus('firstConnect')
  } catch (error) {
    log.error('[DROID] Error when starting...')
    log.error(error)
    droid.end('error')
  }
}

async function returnDroid () {
  return droid
}
async function bindVariables (droid) {
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
      const value = await fun.execute(...args)
      return value
    }
    log.info(`[DROID] added function droid.wca.${fun.name} from ${file}`)
  }
}

module.exports = { returnDroid, initDroid }
