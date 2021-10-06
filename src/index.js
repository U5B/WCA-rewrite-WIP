require('dotenv').config({ path: './config/config.env' })
const { initDroid } = require('./droid/droid.js')
const { initDiscord } = require('./discord/discord.js')
function init () {
  initDiscord()
  initDroid()
}
init()
