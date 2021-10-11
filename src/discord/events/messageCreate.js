const log = require('../../util/log.js')
const { client } = require('../discord.js')
module.exports = {
  name: 'messageCreate',
  async execute (message) {
    if (!message.guild || message.author.bot) return
    const prefix = 'uwu!'
    if (message.content.startsWith(prefix)) return runCommand(message, prefix)
  }
}
async function runCommand (message, prefix) {
  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()
  const command = client.commands.get(commandName) || client.commands.find((command) => command.aliases && command.aliases.includes(commandName))

  if (!command) return message.channel.send({ content: 'Unknown command. Try using a slash command instead!' })

  if (!message.channel.permissionsFor(client.user).has(command.perms.client)) {
    return message.channel.send({ content: `Missing Permissions: ${command.perms.client}` })
  }

  if (!message.channel.permissionsFor(message.member).has(command.perms.user)) {
    return message.channel.send({ content: 'You don\'t have enough permission to execute this command.' })
  }
  try {
    command.execute(client, message, args, prefix)
  } catch (error) {
    log.error(error)
    await message.channel.send({ content: 'An unexpected error occured!' })
  }
}
