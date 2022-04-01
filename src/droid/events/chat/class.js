const regex = require('../../../util/misc/regex.js')
const { returnDroid } = require('../../droid.js')

module.exports = {
  name: 'class',
  regex: regex.selectAClass.chat,
  enabled: true,
  once: false,
  parse: false,
  async execute () {
    const droid = await returnDroid()
    await droid.wca.location('class')
  }
}
