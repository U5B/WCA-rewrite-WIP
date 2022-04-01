const { returnDroid } = require('../../droid.js')
const whitelisted = ['U5B_', 'skywalker998']
module.exports = {
  name: 'sudo',
  regex: /\[([0-9a-zA-Z_]{1,16}) -> me\] (.*)/,
  enabled: true,
  once: false,
  parse: true,
  async execute (matches) {
    const droid = await returnDroid()
    const [, sender, content] = matches
  }
}
