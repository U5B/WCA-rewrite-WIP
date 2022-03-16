const log = require('../util/log.js')

const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const { discord } = require('./discord.js')
const { mongo } = require('../mongo/mongo.js')
const { reload } = require('../util/reload.js')

async function reloadFunctions () {
  await reload() // reload util functions
  // Misc Discord Functions
  log.log('[DISCORD] Binding functions...')
  const functionPath = './functions'
  const functionFolder = fs.readdirSync(path.resolve(__dirname, functionPath)).filter((file) => file.endsWith('.js'))
  for (const file of functionFolder) {
    delete require.cache[require.resolve(`${functionPath}/${file}`)]
    const fun = require(`${functionPath}/${file}`)
    if (fun.enabled === false) continue
    discord.wca[`${fun.name}`] = async function wcaDiscordFunction (...args) {
      args.unshift(discord)
      const value = await fun.execute(...args)
      return value
    }
    log.info(`[DISCORD] added function client.wca.${fun.name} from ${file}`)
  }
}

async function reloadRegularCommands () {
  log.info('[DISCORD] Reloading Regular Commands...')
  discord.wca.commands = new Collection() // regular ugly commands
  const commandFolder = './commands/'
  const discordCommands = fs.readdirSync(path.resolve(__dirname, commandFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordCommands) {
    // delete require cache, make discord commands reloadable
    delete require.cache[require.resolve(`${commandFolder}/${file}`)]
    const command = require(`${commandFolder}/${file}`)
    discord.wca.commands.set(command.name, command)
  }
  log.info('[DISCORD] Reloaded Regular Commands.')
}

let slashCommandsArray = []
async function reloadSlashCommands (deploy) {
  log.info('[DISCORD] Reloading Slash Commands...')
  slashCommandsArray = []
  discord.wca.slashCommands = new Collection()
  const commandFolder = './commands/slash'
  const discordCommands = fs.readdirSync(path.resolve(__dirname, commandFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordCommands) {
    // delete require cache, make discord commands reloadable
    delete require.cache[require.resolve(`${commandFolder}/${file}`)]
    // then get the data
    const data = require(`${commandFolder}/${file}`)
    await discord.wca.slashCommands.set(data.name, data)
    slashCommandsArray.push(data)
  }
  log.info('[DISCORD] Reloaded Slash Commands.')
  if (deploy === true) await deploySlashCommands()
}

async function deploySlashCommands () {
  log.info('[DISCORD] Deploying Slash Commands...')
  const guilds = discord.guilds.cache.map(guild => guild.id)
  for (const guildId of guilds) {
    const fullPermissions = [] // why does this have to be per guild aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    const guild = discord.guilds.cache.get(guildId)
    await mongo.wca.fetchDiscordOptions(guild)
    const guildCommands = await discord.application.commands.set(slashCommandsArray, guildId)
    for (const command of guildCommands.values()) {
      const data = await discord.wca.slashCommands.get(command.name)
      if (!data) return await discord.application.commands.delete(command.id, guildId)
      fullPermissions.push({ id: command.id, permissions: data.permissions })
    }
    guild.commands.permissions.set({ fullPermissions })
  }
  log.info('[DISCORD] Deployed Slash Commands.')
}
module.exports = { reloadRegularCommands, reloadSlashCommands, deploySlashCommands, reloadFunctions }
