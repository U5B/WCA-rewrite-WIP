require('dotenv').config({ path: './config/config.env' })
const log = require('./util/log.js')
const { initMongo, mongo } = require('./mongo/mongo.js')
const { initDiscord, discord } = require('./discord/discord.js')
async function init () {
  await panic()
  await initMongo()
  await initDiscord()
}
init()

async function panic () {
  // SIGINT, SIGKILL, SIGTERM, uncaughtException
  process.once('SIGINT', shutdownProcess)
  process.once('SIGTERM', shutdownProcess)
  process.on('uncaughtException', async (err) => {
    log.error(err)
    shutdownProcess()
  })
}
async function shutdownProcess () {
  await shutDownDiscord()
  process.exit(1)
}
async function shutDownDiscord () {
  if (!discord?.wca) return
  await discord.wca.setActivity('dead')
  await discord.wca.sendStatus('stopProcess', 'HELP!')
  // purge bomb messages
  const msgIds = discord.wca.bombArray
  if (msgIds) {
    for (const msg of msgIds) {
      try {
        await msg[0].delete()
        await msgIds.delete(msg)
      } catch (error) {
        log.error(error)
      }
    }
  }
}
