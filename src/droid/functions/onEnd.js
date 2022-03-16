const fs = require('fs')
const path = require('path')
const ChatMessage = require('prismarine-chat')('1.16')

const { mongo } = require('../../mongo/mongo.js')
const server = require('../../util/api/servers.js')
const log = require('../../util/log.js')
const regex = require('../../util/misc/regex.js')
const { discord } = require('../../discord/discord.js')
const util = require('../../util/misc/utils.js')

const { initDroid } = require('../droid.js')

module.exports = {
  name: 'onEnd',
  enabled: true,
  async execute (droid, kickReason = 'socketClosed', loggedIn) {
    const response = await determineEndReason(kickReason)
    await cleanup()
    if (response.restart === true && discord.wca.droidRetryAttempts < 2) {
      await discord.wca.sendStatus('kick', `Restarting in **${response.duration}s**.\nReason: \`${response.reason}\``)
      await log.error(`[DROID] Kicked... ${response.reason}`)
      let duration = response.duration
      await log.warn(`[DROID] RESTARTING IN ${duration} SECONDS...`)
      duration *= 1000
      await util.sleep(duration)
      await log.warn('[DROID] RESTARTING NOW')
      initDroid(true)
    } else if (response.restart === false || discord.wca.droidRetryAttempts >= 2) {
      await log.error('[DROID] WCA IS DEAD POG! DID SOMEONE FINALLY BAN US?')
      await log.log(`[DROID] Stopped... ${response.reason}`)
      await discord.wca.sendStatus('stop', `Reason: ${response.reason}`)
    }
  }
}

async function determineEndReason (kickReason) {
  const response = { reason: kickReason, restart: false, duration: 15 }
  switch (kickReason) {
    // used for bot.end()
    case 'socketClosed': {
      response.restart = undefined
      break
    }
    case 'wca:end': {
      response.restart = false
      break
    }
    case 'keepAliveError': {
      response.restart = true
      response.duration = 5
      break
    }
    default: {
      if (!/\{.+\}/.test(kickReason)) {
        response.restart = false
        break
      }
      try {
        kickReason = await new ChatMessage(await JSON.parse(kickReason)).toString().trim().split('\n')
        response.reason = kickReason
      } catch (e) {
        log.error(e)
        response.restart = false
        break
      }
      switch (true) {
        case regex.kick.restart.test(kickReason[0]): {
          response.restart = true
          response.duration = 30
          break
        }
        case regex.kick.alreadyConnected.test(kickReason[0]): { // only for kicks
          response.restart = true
          response.duration = 60
          discord.wca.droidRetryAttempts++
          break
        }
        default: {
          response.restart = false
          break
        }
      }
    }
  }
  return response
}

async function cleanup () {
  await server.clearInterval()
}
