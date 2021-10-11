const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const { client } = require('./discord.js')

async function reloadRegularCommands () {
  client.commands = new Collection() // regular ugly commands
  const commandFolder = './commands/'
  const discordCommands = fs.readdirSync(path.resolve(__dirname, commandFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordCommands) {
    // delete require cache, make discord commands reloadable
    delete require.cache[require.resolve(`${commandFolder}/${file}`)]
    const command = await require(`${commandFolder}/${file}`)
    client.commands.set(command.name, command)
  }
}

let slashCommandsArray = []
async function reloadSlashCommands (deploy) {
  slashCommandsArray = []
  client.slashCommands = new Collection()
  const commandFolder = './commands/slash'
  const discordCommands = fs.readdirSync(path.resolve(__dirname, commandFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordCommands) {
    // delete require cache, make discord commands reloadable
    delete require.cache[require.resolve(`${commandFolder}/${file}`)]
    // then get the data
    const data = await require(`${commandFolder}/${file}`)
    await client.slashCommands.set(data.name, data)
    slashCommandsArray.push(data)
  }
  if (deploy === true) await deploySlashCommands()
}

async function deploySlashCommands () {
  const guilds = client.guilds.cache.map(guild => guild.id)
  for (const guildId of guilds) {
    const fullPermissions = [] // why does this have to be per guild aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    const guild = client.guilds.cache.get(guildId)
    const guildCommands = await client.application.commands.set(slashCommandsArray, guildId)
    for (const command of guildCommands.values()) {
      const data = await client.slashCommands.get(command.name)
      if (!data) return await client.application.commands.delete(command.id, guildId)
      fullPermissions.push({ id: command.id, permissions: data.permissions })
    }
    guild.commands.permissions.set({ fullPermissions })
  }
}
module.exports = { reloadRegularCommands, reloadSlashCommands, deploySlashCommands }
