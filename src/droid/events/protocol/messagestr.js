const { discord } = require('../../../discord/discord.js')
const utils = require('../../../util/misc/utils.js')
const log = require('../../../util/log.js')
const regex = require('../../../util/misc/regex.js')

let chatArray = []
let chatSendTimeout
module.exports = {
  name: 'messagestr',
  enabled: true,
  once: false,
  async execute (droid, messagestr, messagepos, jsonmsg) {
    if (messagepos === 'game_info') return // no more actionbar
    if (regex.chat.spam.test(messagestr)) return // no more spam
    const formattedString = await formatting(jsonmsg) // dialogue is spammy hell, fix pls
    if (formattedString.length > 1000) return // STOP IT WHY YOU SEND MESSAGES WITH 6 BILLION CHARACTERS AAAAAAAAAAAAAAAAAAAAAA

    const currentTime = await utils.discord.time()
    clearTimeout(chatSendTimeout)
    chatArray.push(`${currentTime} ${formattedString}`)
    chatSendTimeout = setTimeout(sendToDiscord, 1000)
    if (chatArray.length >= 10) sendToDiscord()
  }
}

async function sendToDiscord () {
  clearTimeout(chatSendTimeout) // COMMENT: Don't send message to discord if there is already one being executed
  if (chatArray.length === 0) return // COMMENT: Don't care about empty arrays
  const condensedMessage = chatArray.join('\n')
  chatArray = [] // COMMENT: reset the array
  if (condensedMessage.length > 4000) {
    log.error('Message bigger than expected')
  }
  await discord.wca.sendToMultipleServers('chatRaw', condensedMessage)
}

async function formatting (jsonmsg) {
  const msg = jsonmsg.toMotd()
  const stringMsg = jsonmsg.toString()
  let response = stringMsg
  if (/\n/.test(msg)) {
    const lines = msg.split('\n')
    const stringLines = stringMsg.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (regex.chat.dialogue.test(lines[i])) response = stringLines[i]
    }
  } else {
    response = await utils.discord.noMarkdown(stringMsg)
  }
  return response
}
