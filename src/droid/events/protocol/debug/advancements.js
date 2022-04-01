const { wca } = require('../../../../wca/wca.js')

module.exports = {
  name: 'advancements',
  enabled: true,
  once: false,
  async execute (droid, json) {
    const wcaFunction = await wca()
    await wcaFunction.advancements(json)
  }
}
