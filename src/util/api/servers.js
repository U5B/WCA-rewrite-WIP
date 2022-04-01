const axios = require('axios')
const { returnDroid } = require('../../droid/droid')
const log = require('../log')
const placeholder = require('../../data/servers.json')
let servers
let timeout
let loop = true
const ratelimit = {
  current: 1,
  max: 800,
  release: 600000,
  timestamp: Date.now()
}

const server = {}
server.fetchServers = async function () {
  try {
    if (ratelimit.current >= ratelimit.max) throw Error(`Wynntils ratelimit reached: ${ratelimit.current}/${ratelimit.max}`)
    const response = await axios.get('https://athena.wynntils.com/cache/get/serverList')
    if (response.status !== 200) throw Error(`Wynntils returned: ${response.status} with ${response.statusText}`)

    ratelimit.timestamp = Number(response.headers.timestamp)
    ratelimit.current = Number(response.headers['w-ratelimit-current'])
    ratelimit.max = Number(response.headers['w-ratelimit-max'])
    ratelimit.release = Number(response.headers['w-ratelimit-release'])

    servers = response.data.servers
    return servers
  } catch (error) {
    await log.error(error)
  }
}

server.startInterval = async function () {
  let interval = 150000 // 2.5 minutes
  clearTimeout(timeout)
  await this.fetchServers()
  if (loop === false) return
  if (interval >= ratelimit.release) interval = ratelimit.release
  timeout = setTimeout(() => {
    this.startInterval()
  }, interval)
}

server.clearInterval = async function () {
  loop = false
  clearTimeout(timeout)
}

server.fetchServersCached = async function () {
  if (servers) return servers
  return placeholder.servers
}

server.fetchPlayerCount = async function (world) {
  let playerCountResponse = -1
  const parsed = servers
  if (parsed && parsed[`${world}`]) {
    playerCountResponse = Object.keys(parsed[`${world}`].players).length
  }
  return playerCountResponse
}

server.getOptimalWorlds = async function (input, playerCount = 36, minutes = 60) {
  const droid = await returnDroid()
  const serverVal = input ?? await server.fetchServersCached()
  const timeInMs = minutes * 60000
  let optimalWorld = Object.entries(serverVal)
    .sort(([worldA, dataA], [worldB, dataB]) => dataA.firstSeen - dataA.firstSeen) // sort by first seen
    .filter(([world, data]) => (data.players).length > 0 && (data.players).length <= playerCount) // greater than 0 but less than 36
    .filter(([world, data]) => (droid.wca.val.ignoredWorlds.indexOf(world) === -1)) // ignore ignored worlds
  const lowestWorldTime = optimalWorld[0][1].firstSeen
  optimalWorld = optimalWorld
    .filter(data => Date.now() - data[1].firstSeen <= (Date.now() - lowestWorldTime) + timeInMs) // 1 hour since last server startup
    .sort(([worldA, dataA], [worldB, dataB]) => (dataA.players).length - (dataB.players).length) // sort by players
  return optimalWorld
}

server.checkServerFull = async function (inputWorld, playerCount = 40) {
  const serverVal = await server.fetchServersCached()
  for (const [world, data] of Object.entries(serverVal)) {
    if (world !== inputWorld) continue
    const players = (data.players).length
    if (!players) continue
    if (playerCount <= players) return true
  }
  return false
}
module.exports = server
