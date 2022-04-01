const log = require('../log.js')
const { noMarkdown } = require('./noMarkdown.js')
const utils = {}

utils.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
utils.promiseTimeout = async function (promise, timeout) {
  return Promise.race([
    promise,
    this.sleep(timeout).then(() => {
      throw new Error('Promise timed out.')
    })
  ])
}
utils.compareObjects = async function (objects, defaultObjects) {
  if (!objects) return defaultObjects
  for (const [name, content] of Object.entries(defaultObjects)) {
    if (typeof content === 'object' && objects[name]) await this.compareObjects(objects[name], content)
    else if (typeof content === 'object' && !objects[name]) objects[name] = content
    else if (!objects[name]) objects[name] = content
  }
  return objects
}

utils.discord = {}
utils.discord.noMarkdown = async function (message) {
  // const unescaped = message.replace(/\\(\||@|>|<|:|\*|_|`|~|\\)/g, '$1') // COMMENT: unescape any "backslashed" markdown
  // const escaped = unescaped.replace(/(\||@|>|<|:|\*|_|`|~|\\)/g, '\\$1') // COMMENT: escape the markdown
  const escaped = await noMarkdown(message)
  return escaped
}
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
