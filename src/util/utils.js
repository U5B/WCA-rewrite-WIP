const log = require('./log.js')
const utils = {}
utils.discord = {}

utils.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
utils.discord.time = async function () {
  return `<t:${Math.floor(Date.now() / 1000)}:T>`
}
utils.discord.activity = {
  play: 'PLAYING',
  stream: 'STREAMING',
  listen: 'LISTENING',
  watch: 'WATCHING',
  compete: 'COMPETING'
}
utils.discord.status = {
  green: 'online',
  yellow: 'idle',
  gray: 'invisible',
  red: 'dnd'
}

module.exports = utils
