const fs = require('fs')
const path = require('path')

const log = require('../../util/log.js')

async function bindEvents (droid) {
  // Modified from xMdb - https://github.com/xMdb/hypixel-guild-chat-bot/blob/2c01ff7c92cd6e7cce860835f9b64381a8335a1a/app.js#L92
  const chatFolder = './chat'
  const motdFolder = './motd'
  const eventFolder = './protocol'
  const debugFolder = './protocol/debug'
  const chatEvents = fs.readdirSync(path.resolve(__dirname, chatFolder)).filter((file) => file.endsWith('.js'))
  const motdEvents = fs.readdirSync(path.resolve(__dirname, motdFolder)).filter((file) => file.endsWith('.js'))
  const otherEvents = fs.readdirSync(path.resolve(__dirname, eventFolder)).filter((file) => file.endsWith('.js'))
  const debugEvents = fs.readdirSync(path.resolve(__dirname, debugFolder)).filter((file) => file.endsWith('.js'))
  // Iterate through each file in the folder
  for (const file of chatEvents) {
    // nothing can go wrong if everything is reloadable muhahahahaha
    delete require.cache[require.resolve(`${chatFolder}/${file}`)]
    // Require the file in the folder
    const event = require(`${chatFolder}/${file}`)
    if (event.enabled === false) continue
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

    console.log(typeof event.regex)
    const chatOptions = {}
    // By default return the groups and repeat it
    chatOptions.parse = event.parse ? event.parse : true
    chatOptions.repeat = !event.once ? !event.once : true
    for (const pattern of event.regex) {
      droid.addChatPattern(`${event.name}`, pattern, chatOptions)
    }
    log.info(`name: <chat:${event.name} with parse: <${chatOptions.parse}> repeat: <${chatOptions.repeat}> regex: <${event.regex}>`)
  }

  // exact same thing as above except for motd
  for (const file of motdEvents) {
    delete require.cache[require.resolve(`${motdFolder}/${file}`)]
    const event = require(`${motdFolder}/${file}`)
    if (event.enabled === false) continue
    const listener = async function usbEventListenerChat (...args) {
      args.unshift(droid)
      event.execute(...args)
    }
    if (event.once === true) {
      droid.once(`motd:${event.name}`, listener)
      log.info(`once | added motd listener <${event.name}> from ${file}`)
    } else { // else don't do that
      droid.on(`motd:${event.name}`, listener)
      log.info(`on   | added motd listener <${event.name}> from ${file}`)
    }
    console.log(typeof event.regex)

    const chatOptions = {}
    chatOptions.parse = event.parse ? event.parse : true
    chatOptions.repeat = !event.once ? !event.once : true
    for (const pattern of event.regex) {
      droid.addMotdPattern(`${event.name}`, pattern, chatOptions)
    }
    log.info(`name: <motd:${event.name} with parse: <${chatOptions.parse}> repeat: <${chatOptions.repeat}> regex: <${event.regex}>`)
  }

  for (const file of debugEvents) {
    delete require.cache[require.resolve(`${debugFolder}/${file}`)]
    const event = require(`${debugFolder}/${file}`)
    if (event.enabled === false) continue
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
    delete require.cache[require.resolve(`${eventFolder}/${file}`)]
    const event = require(`${eventFolder}/${file}`)
    if (event.enabled === false) continue
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
module.exports = { bindEvents }
