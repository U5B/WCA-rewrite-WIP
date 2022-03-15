const { discord } = require('../discord.js')
const utils = require('../../util/utils.js')

let lastPresence = null
module.exports = {
  name: 'setActivity',
  enabled: true,
  async execute (_, msg) {
    const presence = {
      status: utils.discord.status.red, // dnd
      afk: false,
      activities: [
        {
          name: 'for /droid start',
          type: utils.discord.activity.watch
        }
      ]
    }
    switch (msg) {
      case 'onLobby': {
        presence.activities[0].name = 'the lobby'
        presence.status = utils.discord.status.yellow
        break
      }
      case 'onClass': {
        presence.activities[0].name = 'class menu'
        presence.status = utils.discord.status.yellow
        break
      }
      case 'onBlackBox': {
        presence.activities[0].name = 'a black box'
        presence.status = utils.discord.status.red
        break
      }
      case 'onWorld': {
        presence.activities[0].name = 'Wynncraft chat'
        presence.status = utils.discord.status.green
        break
      }
      default: {
        presence.activities[0].name = 'for /droid start'
        presence.status = utils.discord.status.red
        break
      }
    }
    if (lastPresence !== presence) {
      discord.user.setPresence(presence)
      lastPresence = presence
    }
  }
}
