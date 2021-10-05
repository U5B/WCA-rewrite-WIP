const config = require('../config/droid.json')
const mineflayer = require('mineflayer')
const events = require('./events/events.js')
const e = {
  droid: undefined,
  start: undefined
}
e.start = function start () {
  const options = {
    username: process.env.mcEmail,
    password: process.env.mcPassword,
    host: config.host,
    port: config.port,
    version: config.version,
    brand: config.brand,
    viewDistance: config.viewDistance,
    hideErrors: false
  }
  const droid = mineflayer.createBot(options)
  e.droid = droid
  events.bindEvents(droid)
  return droid
}
module.exports = e
