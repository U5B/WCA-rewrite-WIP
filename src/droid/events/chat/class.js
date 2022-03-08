const log = require('../../../util/log.js')
const regex = require('../../../util/regex.js')

module.exports = {
  name: 'class',
  regex: [regex.selectAClass.chat],
  enabled: true,
  once: false,
  parse: false,
  matchAll: false,
  async execute (droid) {
    droid.wca.location('class')
  }
}
