const log = require('../../../util/log')
const regex = require('../../../util/regex.js')
module.exports = {
  name: 'motdLobbyJoin',
  regex: [/§e(\w+) joined the game§r/, /§e(\w+) left the game§r/],
  once: false,
  parse: false,
  async execute () {
    log.info('e')
  }
}
