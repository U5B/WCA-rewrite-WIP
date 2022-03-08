const fs = require('fs')
const path = require('path')

const log = require('../../util/log.js')

async function bindEvents (droid) {
  log.log('[DROID] Binding events...')
  // Modified from xMdb - https://github.com/xMdb/hypixel-guild-chat-bot/blob/2c01ff7c92cd6e7cce860835f9b64381a8335a1a/app.js#L92
  const chatPath = './chat'
  const motdPath = './motd'
  const eventPath = './protocol'
  const debugPath = './protocol/debug'
  const wcaPath = './wca'
  const chatFolder = fs.readdirSync(path.resolve(__dirname, chatPath)).filter((file) => file.endsWith('.js'))
  const motdFolder = fs.readdirSync(path.resolve(__dirname, motdPath)).filter((file) => file.endsWith('.js'))
  const otherFolder = fs.readdirSync(path.resolve(__dirname, eventPath)).filter((file) => file.endsWith('.js'))
  const debugFolder = fs.readdirSync(path.resolve(__dirname, debugPath)).filter((file) => file.endsWith('.js'))
  const wcaFolder = fs.readdirSync(path.resolve(__dirname, wcaPath))

  // Iterate through each file in the folder (droid._client.on('name'))
  for (const file of debugFolder) {
    delete require.cache[require.resolve(`${debugPath}/${file}`)]
    const event = require(`${debugPath}/${file}`)
    if (event.enabled === false) continue
    const listener = async function wcaDroidEvents (...args) {
      args.unshift(droid)
      const value = await event.execute(...args)
      return value
    }
    if (event.once === true) {
      droid._client.once(event.name, listener)
      log.info(`[DROID] once | added debug listener <${event.name}> from ${file}`)
    } else {
      droid._client.on(event.name, listener)
      log.info(`[DROID] on   | added debug listener <${event.name}> from ${file}`)
    }
  }

  // (droid.on('name'))
  for (const file of otherFolder) {
    delete require.cache[require.resolve(`${eventPath}/${file}`)]
    const event = require(`${eventPath}/${file}`)
    if (event.enabled === false) continue
    const listener = async function wcaDroidEvents (...args) {
      args.unshift(droid)
      const value = await event.execute(...args)
      return value
    }
    if (event.once === true) {
      droid.once(event.name, listener)
      log.info(`[DROID] once | added event listener <${event.name}> from ${file}`)
    } else {
      droid.on(event.name, listener)
      log.info(`[DROID] on   | added event listener <${event.name}> from ${file}`)
    }
  }

  // (droid.on('chat:name'))
  for (const file of chatFolder) {
    /*
      name: required (string)
      regex: required (array)
      execute: required (function)
      once: optional (boolean) defaults to false
      enabled: optional (boolean) defaults to true
      parse: optional (boolean) defaults to true
      matchAll: optional (boolean) defaults to false
    */
    // nothing can go wrong if everything is reloadable muhahahahaha
    delete require.cache[require.resolve(`${chatPath}/${file}`)]
    // Require the file in the folder
    const event = require(`${chatPath}/${file}`)
    if (event.enabled === false) continue
    const listener = async function wcaDroidEvents (...args) {
      args.unshift(droid)
      const value = await event.execute(...args)
      return value
    }
    if (event.once === true) { // if once is true then only listen for the event once
      droid.once(`chat:${event.name}`, listener)
      log.info(`[DROID] once | added chat listener <${event.name}> from ${file}`)
    } else { // else don't do that
      droid.on(`chat:${event.name}`, listener)
      log.info(`[DROID] on   | added chat listener <${event.name}> from ${file}`)
    }

    const chatOptions = {}
    // By default return the groups and repeat it
    chatOptions.parse = event.parse ? event.parse : true
    chatOptions.repeat = !event.once ? !event.once : true
    console.log(typeof event.regex)
    if (event.matchAll === true) {
      droid.addChatPatternSet(`${event.name}`, event.regex, chatOptions)
    } else {
      for (const pattern of event.regex) {
        droid.addChatPattern(`${event.name}`, pattern, chatOptions)
      }
    }
    log.info(`[DROID] name: <chat:${event.name} with parse: <${chatOptions.parse}> repeat: <${chatOptions.repeat}> regex: <${event.regex}>`)
  }

  // // (droid.on('motd:name'))
  for (const file of motdFolder) {
    delete require.cache[require.resolve(`${motdPath}/${file}`)]
    const event = require(`${motdPath}/${file}`)
    if (event.enabled === false) continue
    const listener = async function wcaDroidEvents (...args) {
      args.unshift(droid)
      const value = await event.execute(...args)
      return value
    }
    if (event.once === true) {
      droid.once(`motd:${event.name}`, listener)
      log.info(`[DROID] once | added motd listener <${event.name}> from ${file}`)
    } else { // else don't do that
      droid.on(`motd:${event.name}`, listener)
      log.info(`[DROID] on   | added motd listener <${event.name}> from ${file}`)
    }

    const chatOptions = {}
    chatOptions.parse = event.parse ? event.parse : true
    chatOptions.repeat = !event.once ? !event.once : true
    if (event.matchAll === true) {
      droid.addMotdPatternSet(`${event.name}`, event.regex, chatOptions)
    } else {
      for (const pattern of event.regex) {
        droid.addMotdPattern(`${event.name}`, pattern, chatOptions)
      }
    }
    log.info(`[DROID] name: <motd:${event.name} with parse: <${chatOptions.parse}> repeat: <${chatOptions.repeat}> regex: <${event.regex}>`)
  }

  // (droid.on('wca:name'))
  for (const folder of wcaFolder) {
    const files = fs.readdirSync(path.resolve(__dirname, `${wcaPath}/${folder}`)).filter((file) => file.endsWith('.js'))
    for (const file of files) {
      delete require.cache[require.resolve(`${wcaPath}/${folder}/${file}`)]
      const event = require(`${wcaPath}/${folder}/${file}`)
      if (event.enabled === false) continue
      const listener = async function wcaDroidEvents (...args) {
        args.unshift(droid)
        const value = await event.execute(...args)
        return value
      }
      if (event.once === true) {
        droid.once(`wca:${event.name}`, listener)
        log.info(`[DROID] once | added wca listener <${event.name}> from ${folder}/${file}`)
      } else { // else don't do that
        droid.on(`wca:${event.name}`, listener)
        log.info(`[DROID] on   | added wca listener <${event.name}> from ${folder}/${file}`)
      }
    }
  }
  log.log('[DROID] Binded events.')
}
module.exports = { bindEvents }
