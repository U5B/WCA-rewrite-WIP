require('dotenv').config({ path: './config/config.env' })
const log = require('./util/log.js')
const { initMongo, mongo } = require('./mongo/mongo.js')
const { initDiscord } = require('./discord/discord.js')
async function init () {
  await initMongo()
  await initDiscord()
}
init()
