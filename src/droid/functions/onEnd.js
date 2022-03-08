const fs = require('fs')
const path = require('path')
const ChatMessage = require('prismarine-chat')('1.16')

const { mongo } = require('../../mongo/mongo.js')
const server = require('../../util/api/servers.js')
const log = require('../../util/log.js')
const regex = require('../../util/regex.js')
const util = require('../../util/utils.js')

const { initDroid } = require('../droid.js')

module.exports = {
  name: 'onEnd',
  enabled: true,
  async execute (droid, kickReason, loggedIn) {
    let shouldRestart = false
    log.error(kickReason)
    shouldRestart = await determineEndReason(kickReason)
    await cleanup()
    if (shouldRestart === true) {
      log.warn('RESTARTING IN 15 SECONDS...')
      await util.sleep(15000)
      log.warn('RESTARTING NOW')
      initDroid(true)
    }
  }
}

async function determineEndReason (kickReason) {
  switch (kickReason) {
    // used for bot.end()
    case 'socketClosed': {
      return undefined
    }
    case 'keepAliveError': {
      return true
    }
    default: {
      if (/\{.+\}/.test(kickReason)) return false
      try {
        kickReason = await new ChatMessage(await JSON.parse(kickReason)).toString().trim().split('\n')
      } catch (e) {
        return false
      }
      switch (true) {
        case regex.kick.restart.test(kickReason[0]): {
          // restart
          return true
        }
        case regex.kick.alreadyConnected.test(kickReason[0]): {
          // restart with special properties
          return true
        }
      }
      return false
    }
  }
}

async function cleanup () {
  await server.clearInterval()
}
