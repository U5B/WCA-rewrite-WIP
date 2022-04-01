const { Timer } = require('easytimer.js')

const log = require('../../util/log.js')
const { discord } = require('../discord.js')
const { mongo } = require('../../mongo/mongo.js')
const servers = require('../../util/api/servers.js')
const { sleep } = require('../../util/misc/utils.js')

const regex = require('../../util/misc/regex.js')
const utils = require('../../util/misc/utils.js')
const worldRegex = regex.regexCreate(regex.group.world)

const playerCountMax = 40
discord.wca.bombArray = []
module.exports = {
  name: 'logBomb',
  enabled: true,
  async execute (discord, username, bomb, world) {
    const value = await checkValidBomb(username, bomb, world)
    return value
  }
}

async function checkValidBomb (username, bomb, world) {
  // Validation
  let bombDuration = 1 // time in minutes
  switch (bomb) {
    case 'Combat XP': {
      bombDuration = 20
      break
    }
    case 'Dungeon': {
      bombDuration = 10
      break
    }
    case 'Loot': {
      bombDuration = 20
      break
    }
    case 'Profession Speed': {
      bombDuration = 10
      break
    }
    case 'Profession XP': {
      bombDuration = 20
      break
    }
    case 'test': { // debug
      break
    }
    default: {
      await log.error(`[DROID] invalid bomb: ${bomb}`)
      return
    }
  }
  if (!worldRegex.test(world)) return false
  await log.info(`[DROID] logged ${bomb} bomb on ${world}`)
  await mongo.wca.updateBomb(world, bomb)

  const bombUsername = await discord.wca.noMarkdown(username)
  const playerCount = await servers.fetchPlayerCount(world)
  const bombPrefix = await utils.discord.time() + '' // get time format in seconds
  const bombSuffix = `**${world}** by ${bombUsername}`
  const bombTimer = `(**${bombDuration}:00** left) **[${playerCount}/${playerCountMax}]**`
  const bombMessage = [
    bombPrefix,
    bombSuffix,
    bombTimer
  ]
  startBombTimer(bomb, bombDuration, bombMessage, bombTimer, world)
  return { bomb, bombDuration, bombMessage, bombTimer, world }
}

async function startBombTimer (bomb, duration, messageArray, timerMessage, world) {
  let messageIdArray = await sendToMultipleServers(bomb, messageArray, timerMessage)
  discord.wca.bombArray = messageIdArray
  const timer = new Timer()
  timer.start({ countdown: true, startValues: { minutes: duration }, target: { minutes: 0 }, precision: 'seconds' })
  timer.on('secondsUpdated', async () => {
    const timeLeftMinutes = timer.getTimeValues().minutes
    const timeLeftSeconds = timer.getTimeValues().seconds
    if (timeLeftSeconds === 0 || timeLeftSeconds === 30) {
      if (timeLeftMinutes === 0 && timeLeftSeconds === 0) {
        messageIdArray = await deleteToMultipleServers(messageIdArray)
      } else {
        const playerCount = await servers.fetchPlayerCount(world)
        const timerMessageEdit = `(**${timer.getTimeValues().toString(['minutes', 'seconds'])} left)** **[${playerCount}/${playerCountMax}]**`
        messageIdArray = await editToMultipleServers(messageIdArray, timerMessageEdit)
      }
      discord.wca.bombArray = messageIdArray
    }
  })
}

async function sendToMultipleServers (bomb, msg, timerMessage) {
  const msgIds = new Set()
  const options = await mongo.wca.fetch('discord')
  for (const option of options) {
    const guildId = option._id
    const channelId = option.channels[bomb] || option.channels.bomb
    if (!channelId) return // make sure you have a channel to send to lol
    const roleId = option.roles[bomb]
    const fallbackRoleId = option.roles.bomb
    let roleName = `[${bomb}]`
    if (roleId) {
      roleName = `<@&${roleId}>`
    } else if (fallbackRoleId) {
      roleName = `<@&${fallbackRoleId}> [${bomb}]`
    } else {
      roleName = `[${bomb}]`
    }
    const bombEmoji = option.emojis[bomb] || option.emojis.bomb || ''
    const message = `${msg[0]} ${bombEmoji} ${roleName} ${msg[1]}`
    const channel = discord.guilds.cache.get(`${guildId}`).channels.cache.get(`${channelId}`)
    if (channel) {
      const msgId = await channel.send(`${message} ${timerMessage}`)
      const addObject = [msgId, message]
      msgIds.add(addObject)
    }
  }
  return msgIds
}
async function editToMultipleServers (msgIds, timerMessage) {
  for (const msg of msgIds) {
    try {
      await msg[0].edit(`${msg[1]} ${timerMessage}`)
    } catch (error) {
      await log.error(error)
    }
  }
  return msgIds
}
async function deleteToMultipleServers (msgIds) {
  for (const msg of msgIds) {
    try {
      await msg[0].delete()
      await msgIds.delete(msg)
    } catch (error) {
      await log.error(error)
    }
  }
  // try again if somehow it didn't work
  if (msgIds) {
    await sleep(5000)
    for (const msg of msgIds) {
      try {
        await msg[0].delete()
        await msgIds.delete(msg)
      } catch (error) {
        await log.error(error)
      }
    }
  }
  return msgIds
}
