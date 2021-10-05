require('dotenv').config({ path: './config/config.env' })
const droid = require('./droid/droid.js')
const discord = require('./discord/discord.js')
function init () {
  discord.start()
  droid.start()
}
init()
