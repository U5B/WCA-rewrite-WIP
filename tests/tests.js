/* eslint-env mocha */
const assert = require('assert')
const ChatMessage = require('prismarine-chat')('1.16')

const regex = require('../src/util/misc/regex')

async function run () {
  describe('chat', testChat)
}

async function testChat () {
  const invalidChat = require('./data/invalid.json')
  it('motd regexs', async () => {
    for (const raw of invalidChat) {
      const motd = new ChatMessage(raw).toMotd()
      await regexTest(motd, regex.bomb, false)
    }
    return true
  })
}

async function regexTest (str, regex, boolean) {
  for (const name of Object.values(regex)) {
    assert.ok(name.test(str) === boolean)
  }
}

run()
