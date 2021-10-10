const fs = require('fs')
const util = require('util')

const debug = {
  chat: require('debug')('chat'),
  log: require('debug')('log'),
  info: require('debug')('info'),
  debug: require('debug')('debug'),
  verbose: require('debug')('verbose'),
  error: require('debug')('error'),
  warn: require('debug')('warn')
}
const chalk = require('chalk')
const errors = chalk.bold.red
const warns = chalk.bold.yellow
debug.chat.color = 10
debug.log.color = 4
debug.info.color = 0
debug.verbose.color = 0
debug.debug.color = 0

debug.error.color = 1
debug.warn.color = 3

async function getContent (input) {
  let text = input
  if (typeof text === 'object') text = JSON.stringify(text, null, 2)
  const time = new Date(Date.now()).toLocaleString('en-US')
  return `[${time}] ${text}`
}
const log = {}
log.log = async function (input) {
  const output = await getContent(input)
  debug.log(output)
}
log.chat = async function (input) {
  const output = await getContent(input)
  debug.chat(output)
}
log.info = async function (input) {
  const output = await getContent(input)
  debug.info(output)
}
log.verbose = async function (input) {
  const output = await getContent(input)
  debug.verbose(output)
}
log.debug = async function (input) {
  const output = await getContent(input)
  debug.debug(output)
}
log.warn = async function (input) {
  const output = await getContent(input)
  debug.warn(output)
}
log.error = async function (input) {
  const output = await getContent(input)
  debug.error(output)
}

module.exports = log
