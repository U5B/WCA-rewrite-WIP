const log = require('../../../util/log')

module.exports = {
  name: 'lobbyJoin',
  regex: [/(\w+) joined the game/, /(\w+) left the game/],
  once: false,
  parse: false,
  async execute () {
    log.info('a')
  }
}
