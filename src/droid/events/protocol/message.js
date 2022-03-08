const log = require('../../../util/log.js')

module.exports = {
  name: 'message',
  enabled: true,
  once: false,
  async execute (droid, jsonMsg, messagepos) {
    if (messagepos !== 'game_info') await log.chatAnsi(jsonMsg.toAnsi())
  }
}

/*
async function champion (message) {
  if (message.json.extra) {
    for (let i = 0; i < message.json.extra.length; i++) {
      // check if the nicked IGN matches
      if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[2]?.text === universal.info.droidIGN && message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
        universal.info.droidNickedIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[0]?.text
        universal.info.realIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
      } else if (message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[1]?.text === '\'s real username is ') {
        universal.info.realIGN = message.json.extra[i]?.extra?.[0]?.hoverEvent?.value?.[2]?.text
        // nickUsername = message.json?.extra[i].extra?.[0]?.hoverEvent?.value?.[0]?.text
      }
    }
  }

  */
