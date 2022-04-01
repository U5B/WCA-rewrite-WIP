require('dotenv').config({ path: './config/config.env' })
const fs = require('fs')
const log = require('./util/log.js')
const { initMongo, mongo } = require('./mongo/mongo.js')
const { initDiscord, discord } = require('./discord/discord.js')
async function init () {
  if (!fs.existsSync('./config/config.env')) return
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
    await log.error(err)
    shutdownProcess()
  })
}
async function shutdownProcess () {
  try {
    await shutDownDiscord()
    await shutDownMongo()
  } catch {
    process.exit(1)
  }
  process.exit(1)
}
async function shutDownMongo () {
  if (!mongo?.wca) return
  await mongo.close(true) // yeet the child
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
        await log.error(error)
      }
    }
  }
}
