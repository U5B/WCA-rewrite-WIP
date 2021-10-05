const fs = require('fs')
const path = require('path')

const { Client, Collection, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

const config = require('../config/discord.json')

const e = {
  client: undefined,
  start: undefined
}
e.start = async function start () {
  client.commands = new Collection()
  client.slashCommands = new Collection()

  const eventFolder = './events'
  const commandFolder = './commands'
  // discord events
  const discordEvents = fs.readdirSync(path.resolve(__dirname, eventFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordEvents) {
    const event = require(`${eventFolder}/${file}`)
    client.on(event.name, (...args) => event.execute(...args))
  }
  // discord commaands
  const discordCommands = fs.readdirSync(path.resolve(__dirname, commandFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordCommands) {
    const command = require(`${commandFolder}/${file}`)
    client.commands.set(command)
  }
  /*
  client.once('ready', () => {
    console.log('Ready!')
  })

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  })
  */

  client.login(process.env.discordToken)
  e.client = client
}
module.exports = e
