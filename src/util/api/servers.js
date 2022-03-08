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
    log.error(error)
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

server.getOptimalWorlds = async function (input) {
  const droid = await returnDroid()
  const serverVal = input ?? await server.fetchServersCached()
  let optimalWorld = Object.entries(serverVal)
    .sort(([worldA, a], [worldB, b]) => b.firstSeen - a.firstSeen) // sort by first seen
    .filter(a => (a[1].players).length > 0 && (a[1].players).length <= 36) // greater than 0 but less than 36
    .filter(a => (droid.wca.val.ignoredWorlds.indexOf(a[0]) === -1))
  const lowestWorldTime = optimalWorld[0][1].firstSeen
  optimalWorld = optimalWorld
    .filter(data => Date.now() - data[1].firstSeen <= (Date.now() - lowestWorldTime) + 3600000) // 1 hour since last server startup
    .sort(([worldA, a], [worldB, b]) => (a.players).length - (b.players).length) // sort by players
  return optimalWorld
}

server.getOptimalWorldsCache = async function ({ time = 60, maxPlayers = 36 }) {
  const droid = await returnDroid()
  const serverVal = await server.fetchServersCached()
  const timeInMs = time * 60000
  let optimalWorld = Object.entries(serverVal)
    .sort(([worldA, a], [worldB, b]) => b.firstSeen - a.firstSeen) // sort by first seen
    .filter(a => (a[1].players).length > 1 && (a[1].players).length <= maxPlayers) // greater than 1 but less than 36
    .filter(a => (droid.wca.val.ignoredWorlds.indexOf(a[0]) === -1))
  const lowestWorldTime = optimalWorld[0][1].firstSeen
  optimalWorld = optimalWorld
    .filter(data => Date.now() - data[1].firstSeen <= (Date.now() - lowestWorldTime) + timeInMs) // 1 hour since last server startup
    .sort(([worldA, a], [worldB, b]) => (a.players).length - (b.players).length) // sort by players
  return optimalWorld
}
module.exports = server
