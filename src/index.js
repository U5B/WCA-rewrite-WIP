require('dotenv').config({ path: './config/config.env' })
const { initDiscord } = require('./discord/discord.js')
const { initMongo } = require('./mongo/mongo.js')
async function init () {
  await initMongo()
  initDiscord()
}
init()
