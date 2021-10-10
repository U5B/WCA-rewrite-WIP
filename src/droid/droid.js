module.exports = {}
const mineflayer = require('mineflayer')
const protocol = require('minecraft-protocol')
const ChatMessage = require('prismarine-chat')('1.16')
const fs = require('fs')
const path = require('path')

const config = require('../config/droid.json')
const log = require('../util/log.js')

async function initDroid (start) {
  protocol.ping({ host: config.host, port: config.port }, (error, ping) => {
    if (error) return error
    return ping
  }).then((ping) => {
    logPing(ping)
    if (start === true) startDroid()
  }).catch((error) => {
    log.error(error)
    setTimeout(() => {
      // retry after 5m
      // probably make this togglable in the future
      initDroid()
    }, 5 * 60000)
  })
}
async function logPing (ping) {
  const description = new ChatMessage(ping.description)
  const version = JSON.stringify(ping.version)
  const players = JSON.stringify(ping.players)
  log.info(description.toString())
  log.info(`${version} || ${players}`)
}

let droid
async function startDroid () {
  droid = await createBot()
  bindEvents(droid)
}
async function returnDroid () {
  return droid
}
async function createBot () {
  const options = {
    username: process.env.mcEmail,
    password: process.env.mcPassword,
    host: config.host,
    port: config.port,
    version: config.version,
    brand: config.brand,
    viewDistance: config.viewDistance,
    hideErrors: false
  }
  return mineflayer.createBot(options)
}

async function bindEvents () {
  const droid = await returnDroid()
  // Modified from xMdb - https://github.com/xMdb/hypixel-guild-chat-bot/blob/2c01ff7c92cd6e7cce860835f9b64381a8335a1a/app.js#L92
  const chatFolder = './events/chat'
  const eventFolder = './events/other'
  const debugFolder = './events/other/debug'
  const chatEvents = fs.readdirSync(path.resolve(__dirname, chatFolder)).filter((file) => file.endsWith('.js'))
  const otherEvents = fs.readdirSync(path.resolve(__dirname, eventFolder)).filter((file) => file.endsWith('.js'))
  const debugEvents = fs.readdirSync(path.resolve(__dirname, debugFolder)).filter((file) => file.endsWith('.js'))
  // Iterate through each file in the folder
  for (const file of chatEvents) {
    // Require the file in the folder
    const event = require(`${chatFolder}/${file}`)
    const listener = async function usbEventListenerChat (...args) {
      args.unshift(droid)
      event.execute(...args)
    }

    if (event.once === true) { // if once is true then only listen for the event once
      droid.once(`chat:${event.name}`, listener)
      log.info(`once | added chat listener <${event.name}> from ${file}`)
    } else { // else don't do that
      droid.on(`chat:${event.name}`, listener)
      log.info(`on   | added chat listener <${event.name}> from ${file}`)
    }

    const chatOptions = {}
    // By default return the groups and repeat it
    chatOptions.parse = event.parse ? event.parse : true
    chatOptions.repeat = !event.once ? !event.once : true
    droid.addChatPattern(`${event.name}`, event.regex, chatOptions)
    log.info(`name: <chat:${event.name} with parse: <${chatOptions.parse}> repeat: <${chatOptions.repeat}> regex: <${event.regex}>`)
  }

  for (const file of debugEvents) {
    const event = require(`${debugFolder}/${file}`)
    const listener = async function usbEventListenerDebug (...args) {
      args.unshift(droid)
      event.execute(...args)
    }

    if (event.once === true) {
      droid._client.once(event.name, listener)
      log.info(`once | added debug listener <${event.name}> from ${file}`)
    } else {
      droid._client.on(event.name, listener)
      log.info(`on   | added debug listener <${event.name}> from ${file}`)
    }
  }

  for (const file of otherEvents) {
    const event = require(`${eventFolder}/${file}`)
    const listener = async function usbEventListenerOther (...args) {
      args.unshift(droid)
      event.execute(...args)
    }

    if (event.once === true) {
      droid.once(event.name, listener)
      log.info(`once | added event listener <${event.name}> from ${file}`)
    } else {
      droid.on(event.name, listener)
      log.info(`on   | added event listener <${event.name}> from ${file}`)
    }
  }
}
module.exports = { returnDroid, initDroid }
