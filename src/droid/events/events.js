const fs = require('fs')
const path = require('path')

const log = require('../../util/log.js')

async function bindEvents (droid) {
  await log.log('[DROID] Binding events...')
  // Modified from xMdb - https://github.com/xMdb/hypixel-guild-chat-bot/blob/2c01ff7c92cd6e7cce860835f9b64381a8335a1a/app.js#L92
  const eventPath = './protocol'
  const debugPath = './protocol/debug'
  const otherFolder = fs.readdirSync(path.resolve(__dirname, eventPath)).filter((file) => file.endsWith('.js'))
  const debugFolder = fs.readdirSync(path.resolve(__dirname, debugPath)).filter((file) => file.endsWith('.js'))

  // Iterate through each file in the folder (droid._client.on('name'))
  for (const file of debugFolder) {
    delete require.cache[require.resolve(`${debugPath}/${file}`)]
    const event = require(`${debugPath}/${file}`)
    if (event.enabled === false) continue
    const listener = async function wcaDroidEvents (...args) {
      args.unshift(droid)
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
      droid._client.once(event.name, listener)
      await log.info(`[DROID] once | added debug listener <${event.name}> from ${file}`)
    } else {
      droid._client.on(event.name, listener)
      await log.info(`[DROID] on   | added debug listener <${event.name}> from ${file}`)
    }
  }

  // (droid.on('name'))
  for (const file of otherFolder) {
    delete require.cache[require.resolve(`${eventPath}/${file}`)]
    const event = require(`${eventPath}/${file}`)
    if (event.enabled === false) continue
    const listener = async function wcaDroidEvents (...args) {
      args.unshift(droid)
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
      droid.once(event.name, listener)
      await log.info(`[DROID] once | added event listener <${event.name}> from ${file}`)
    } else {
      droid.on(event.name, listener)
      await log.info(`[DROID] on   | added event listener <${event.name}> from ${file}`)
    }
  }

  // (droid.on('wca:name'))
  /*
  for (const folder of wcaFolder) {
    const files = fs.readdirSync(path.resolve(__dirname, `${wcaPath}/${folder}`)).filter((file) => file.endsWith('.js'))
    for (const file of files) {
      delete require.cache[require.resolve(`${wcaPath}/${folder}/${file}`)]
      const event = require(`${wcaPath}/${folder}/${file}`)
      if (event.enabled === false) continue
      const listener = async function wcaDroidEvents (...args) {
        args.unshift(droid)
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
        droid.once(`wca:${event.name}`, listener)
        await log.info(`[DROID] once | added wca listener <${event.name}> from ${folder}/${file}`)
      } else { // else don't do that
        droid.on(`wca:${event.name}`, listener)
        await log.info(`[DROID] on   | added wca listener <${event.name}> from ${folder}/${file}`)
      }
    }
  }
  */
  await log.log('[DROID] Binded events.')
}
module.exports = { bindEvents }
