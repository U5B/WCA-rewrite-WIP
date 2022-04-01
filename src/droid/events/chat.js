const fs = require('fs')
const path = require('path')

const log = require('../../util/log.js')

let strRegexArray = []
let motdRegexArray = []
async function reloadChat () {
  await log.log('[DROID] Binding chat...')
  const chatPath = './chat'
  const motdPath = './motd'
  const chatFolder = fs.readdirSync(path.resolve(__dirname, chatPath)).filter((file) => file.endsWith('.js'))
  const motdFolder = fs.readdirSync(path.resolve(__dirname, motdPath)).filter((file) => file.endsWith('.js'))
  // chat folders and parsing
  strRegexArray = []
  motdRegexArray = []
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
    const listener = async function wcaChatStr (...args) {
      let value
      try {
        value = await event.execute(...args)
      } catch (e) {
        await log.error(e)
        value = e
      }
      return value
    }
    if (event.once === true) { // if once is true then only listen for the event once
      await log.info(`[DROID] once | added chat listener <${event.name}> from ${file}`)
    } else { // else don't do that
      await log.info(`[DROID] on   | added chat listener <${event.name}> from ${file}`)
    }
    strRegexArray.push({ name: event.name, regex: event.regex, parse: event.parse, once: event.once, run: listener })
    await log.info(`[DROID] chat | <chat:${event.name}> | regex: <${event.regex}>`)
  }
  // // (droid.on('motd:name'))
  for (const file of motdFolder) {
    delete require.cache[require.resolve(`${motdPath}/${file}`)]
    const event = require(`${motdPath}/${file}`)
    if (event.enabled === false) continue
    const listener = async function wcaChatMotd (...args) {
      let value
      try {
        value = await event.execute(...args)
      } catch (e) {
        await log.error(e)
        value = e
      }
      return value
    }
    if (event.once === true) {
      await log.info(`[DROID] once | added motd listener <${event.name}> from ${file}`)
    } else { // else don't do that
      await log.info(`[DROID] on   | added motd listener <${event.name}> from ${file}`)
    }
    motdRegexArray.push({ name: event.name, regex: event.regex, parse: event.parse, once: event.once, run: listener })
    await log.info(`[DROID] motd | <motd:${event.name}> | regex: <${event.regex}>`)
  }
  await log.log('[DROID] Binded chat.')
}

function chat (json, pos) {
  const str = json.toString()
  const motd = json.toMotd()
  for (const strRegex of strRegexArray) {
    if (strRegex.regex.test(str)) {
      let matches = str
      if (strRegex.parse) matches = strRegex.regex.exec(str)
      strRegex.run(matches, json)
      if (strRegex.once) strRegexArray = strRegexArray.filter(value => value !== strRegex)
      break
    } else {
      continue
    }
  }
  for (const motdRegex of motdRegexArray) {
    if (motdRegex.regex.test(motd)) {
      let matches = motd
      if (motdRegex.parse) matches = motdRegex.regex.exec(motd)
      motdRegex.run(matches, json)
      if (motdRegex.once) motdRegexArray = motdRegexArray.filter(value => value !== motdRegex)
      break
    } else {
      continue
    }
  }
}
module.exports = { reloadChat, chat }
