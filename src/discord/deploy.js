const log = require('../util/log.js')

const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const { discord } = require('./discord.js')
const { mongo, bindFunctions: bindMongoFunctions } = require('../mongo/mongo.js')
const { reload: reloadUtils } = require('../util/reload.js')
const { reload: reloadWCA } = require('../wca/wca.js')
const { reloadChat } = require('../droid/events/chat.js')

async function reloadFunctions () {
  await reloadUtils() // reload util functions
  await bindMongoFunctions() // reload mongo functions
  // Misc Discord Functions
  await log.log('[DISCORD] Binding functions...')
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
    await log.info(`[DISCORD] added function client.wca.${fun.name} from ${file}`)
  }
  // post reload
  await reloadChat()
  await reloadWCA() // reload wca functions (like proxy stuff)
}

async function reloadRegularCommands () {
  await log.info('[DISCORD] Reloading Regular Commands...')
  discord.wca.commands = new Collection() // regular ugly commands
  const commandFolder = './commands/'
  const discordCommands = fs.readdirSync(path.resolve(__dirname, commandFolder)).filter(file => file.endsWith('.js'))
  for (const file of discordCommands) {
    // delete require cache, make discord commands reloadable
    delete require.cache[require.resolve(`${commandFolder}/${file}`)]
    const command = require(`${commandFolder}/${file}`)
    discord.wca.commands.set(command.name, command)
  }
  await log.info('[DISCORD] Reloaded Regular Commands.')
}

let slashCommandsArray = []
async function reloadSlashCommands (deploy) {
  await log.info('[DISCORD] Reloading Slash Commands...')
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
  await log.info('[DISCORD] Reloaded Slash Commands.')
  if (deploy === true) await deploySlashCommands()
}

async function deploySlashCommands () {
  await log.info('[DISCORD] Deploying Slash Commands...')
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
    await guild.commands.permissions.set({ fullPermissions })
  }
  await log.info('[DISCORD] Deployed Slash Commands.')
}
module.exports = { reloadRegularCommands, reloadSlashCommands, deploySlashCommands, reloadFunctions }
