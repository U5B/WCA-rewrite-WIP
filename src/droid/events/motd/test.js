const log = require('../../../util/log')
const regex = require('../../../util/regex.js')
console.log(regex.world.login.motd.green)
console.log(regex.world.login.motd.blue)
module.exports = {
  name: 'motdLobbyJoin',
  regex: [/§e(\w+) joined the game§r/, /§e(\w+) left the game§r/],
  once: false,
  parse: false,
  async execute () {
    log.info('e')
  }
}
