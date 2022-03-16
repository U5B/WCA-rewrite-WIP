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
    if (messagepos === 'game_info') return
    if (regex.chat.spam.test(messagestr)) return
    const formattedString = await utils.discord.noMarkdown(messagestr)
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
  await discord.wca.sendToMultipleServers('chatRaw', condensedMessage)
  chatArray = [] // COMMENT: reset the array
}
