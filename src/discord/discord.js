const fs = require('fs')
const path = require('path')
const { Client, Collection, Intents } = require('discord.js')
const client = new Client({
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
})
const log = require('../util/log')

client.commands = new Collection() // regular ugly commands
client.slashCommands = new Collection() // slash commands poggers
client.login(process.env.discordToken)

async function initDiscord () {
  const eventFolder = './events'
  // discord events
  const discordEvents = fs.readdirSync(path.resolve(__dirname, eventFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordEvents) {
    const event = require(`${eventFolder}/${file}`)
    client.on(event.name, (...args) => event.execute(...args))
  }
  // command handling happens in the ready.js
}
module.exports = { client, initDiscord }
