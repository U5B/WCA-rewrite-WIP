const fs = require('fs')
const path = require('path')

const log = require('../util/log.js')
let functions = {}

async function reload () {
  functions = {}
  const functionPath = './functions'
  const functionFolder = fs.readdirSync(path.resolve(__dirname, functionPath)).filter((file) => file.endsWith('.js'))
  for (const file of functionFolder) {
    delete require.cache[require.resolve(`${functionPath}/${file}`)]
    const fun = require(`${functionPath}/${file}`)
    functions[`${fun.name}`] = async function wcaFunction (...args) {
      let value
      try {
        if (fun.enabled === true) value = await fun.execute(...args)
        else if (fun.enabled === false) value = null
      } catch (e) {
        await log.error(e)
        value = e
      }
      return value
    }
  }
}
async function wca () {
  return functions
}

module.exports = { reload, wca }
