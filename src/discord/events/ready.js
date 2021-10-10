const fs = require('fs')
const path = require('path')
const log = require('../../util/log.js')
const { client } = require('../discord.js')
module.exports = {
  name: 'ready',
  async execute () {
    log.info('READY AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    deployRegularCommands()
    deploySlashCommands()
  }
}
async function deployRegularCommands () {
  const commandFolder = '../commands/'
  const discordCommands = fs.readdirSync(path.resolve(__dirname, commandFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordCommands) {
    const command = await require(`../commands/${file}`)
    client.commands.set(command.name, command)
  }
}
const slashCommandsArray = []
async function deploySlashCommands () {
  const guilds = client.guilds.cache.map(guild => guild.id)
  const commandFolder = '../commands/slash'
  const discordCommands = fs.readdirSync(path.resolve(__dirname, commandFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordCommands) {
    // get data and set them in the collection
    const data = await require(`${commandFolder}/${file}`)
    await client.slashCommands.set(data.name, data)
    slashCommandsArray.push(data)
  }
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
