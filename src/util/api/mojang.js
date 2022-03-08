const mojang = require('mojang-minecraft-api')
const json = require('../../data/guild.json')

const array = []
const array2 = []
async function owo () {
  for await (const member of json.members) {
    array.push(member.name)
    const realName = await mojang.getProfile(member.uuid)
    array2.push(realName.name)
  }
  console.log(array)
  console.log(array2)
}
owo()
