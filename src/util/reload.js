const fs = require('fs')
const path = require('path')

async function reload () {
  // Reload Misc Functions
  const functionPath = './misc'
  const functionFolder = fs.readdirSync(path.resolve(__dirname, functionPath)).filter((file) => file.endsWith('.js'))
  for (const file of functionFolder) {
    delete require.cache[require.resolve(`${functionPath}/${file}`)]
    require(`${functionPath}/${file}`)
  }
}

module.exports = { reload }
