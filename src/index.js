require('dotenv').config({ path: './config/config.env' })
const { initDiscord } = require('./discord/discord.js')
function init () {
  initDiscord()
}
init()
