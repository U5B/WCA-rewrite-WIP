const log = require('../../../util/log.js')
const regex = require('../../../util/misc/regex.js')

module.exports = {
  name: 'class',
  regex: regex.selectAClass.chat,
  enabled: true,
  once: false,
  parse: false,
  async execute (droid) {
    await droid.wca.location('class')
  }
}
