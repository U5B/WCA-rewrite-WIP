const fs = require('fs')
const path = require('path')
const { Client, Intents } = require('discord.js')

const log = require('../util/log.js')

const discord = new Client({
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  intents: [
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS
  ]
})

async function initDiscord () {
  await log.log('[DISCORD] Connecting to Discord...')
  await discord.login(process.env.discordToken)
  await log.log('[DISCORD] Connected to Discord.')

  // discord events
  await log.log('[DISCORD] Binding events...')
  const eventPath = './events'
  const discordFolder = fs.readdirSync(path.resolve(__dirname, eventPath)).filter(file => file.endsWith('.js'))
  for (const file of discordFolder) {
    const event = require(`${eventPath}/${file}`)
    if (event.enabled === false) continue
    const listener = async function wcaDiscordEvent (...args) {
      args.unshift(discord)
      event.execute(...args)
    }
    if (event.once === true) {
      discord.once(event.name, listener)
      await log.info(`[DISCORD] once | added event listener <${event.name}> from ${file}`)
    } else {
      discord.on(event.name, listener)
      await log.info(`[DISCORD] on   | added event listener <${event.name}> from ${file}`)
    }
  }

  discord.wca = {}
  discord.wca.bombArray = []
  discord.wca.droidRetryAttempts = 0
  await discord.application.fetch()

  // Discord Commands
  await log.log('[DISCORD] Loading Commands...')
  const { reloadRegularCommands, reloadSlashCommands, reloadFunctions } = require('./deploy.js')
  await reloadFunctions()
  await reloadRegularCommands()
  await reloadSlashCommands(true)

  await discord.wca.setActivity()
}
module.exports = { discord, initDiscord }
