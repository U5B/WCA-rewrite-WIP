/* eslint-env mocha */
const assert = require('assert')
const ChatMessage = require('prismarine-chat')('1.16')

const regex = require('../src/util/misc/regex')

async function run () {
  describe('chat', testChat)
}

async function testChat () {
  it('bomb regex', async () => {
    const bombRegex = require('./data/bombBell.json')
    for (const raw of bombRegex) {
      const motd = new ChatMessage(raw).toMotd()
      await regexTest(motd, regex.bomb.bell, true)
    }
    return true
  })
}

async function regexTest (string, regex, boolean) {
  const response = { success: false, regex: regex, string: string }
  if (regex.test(string) !== boolean) throw Error(`REGEX MATCH ERROR: wanted: ${boolean}, got: ${response.success}\nstring: ${string}\nregex:  ${regex}`)
  response.success = true
  return response
}

run()
