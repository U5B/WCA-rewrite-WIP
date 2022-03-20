const ChatMessage = require('prismarine-chat')('1.16')

const regex = require('../../util/misc/regex.js')
const log = require('../../util/log.js')

module.exports = {
  name: 'selectAClass',
  enabled: true,
  once: false,
  async execute (droid, window) {
    await selectAClass(droid, window)
  }
}

async function selectAClass (droid, window) {
  const classes = []
  const weights = []
  let classNumber = 0
  const disAllowed = ['structure_void', 'golden_shovel', 'blaze_powder', 'crafting_table']
  const allowedItems = ['bow', 'iron_shovel', 'stick', 'wooden_shovel', 'shears', 'stone_shovel']
  for (const item of window.slots) {
    if (!item) continue
    if (disAllowed.includes(item.name)) continue
    if (!allowedItems.includes(item.name)) continue

    // Create Class
    const classObject = {
      name: classNumber,
      class: 'uwu',
      level: 420,
      xp: 101,
      quests: 0,
      slot: item.slot,
      weight: 0
    }
    // Parse Nickname from Class
    const name = new ChatMessage(JSON.parse(item.customName)).toString().trim() // '[>] Select This Character' or '[>] Select <Nickname>'
    const [, parsedName] = regex.selectAClass.nickname.exec(name)
    if (parsedName !== 'This Character') classObject.name = parsedName
    // Parse the description of the class
    for (const line of item.customLore) {
      const parsedLine = new ChatMessage(JSON.parse(line)).toString().trim()
      if (parsedLine === '') continue
      switch (true) {
        case regex.selectAClass.class.test(parsedLine): { // - Class: Mage
          const [, output] = regex.selectAClass.class.exec(parsedLine)
          classObject.class = output
          break
        }
        case regex.selectAClass.level.test(parsedLine): { // - Level: 69
          const [, output] = regex.selectAClass.level.exec(parsedLine)
          const num = Number(output)
          classObject.level = num
          break
        }
        case regex.selectAClass.xp.test(parsedLine): { // - XP: 42%
          const [, output] = regex.selectAClass.xp.exec(parsedLine)
          const num = Number(output)
          classObject.xp = num
          break
        }
        case regex.selectAClass.quests.test(parsedLine): { // did I test this right
          const [, output] = regex.selectAClass.quests.exec(parsedLine)
          const num = Number(output)
          classObject.quests = num
          break
        }
      }
    }
    // Push it to array
    classes.push(classObject)
    classNumber++
  }
  // calculate weights
  for (const obj of classes) {
    const weightNum = obj.level + obj.quests + 105
    weights.push(weightNum)
  }
  const sorted = await shuffleArray(classes, weights)
  if (sorted?.slot) {
    log.info(`[DROID] picked class: ${sorted.class}, lvl: ${sorted.level}, xp: ${sorted.xp}`)
    droid.clickWindow(sorted.slot, 0, 0)
  } else {
    log.info(`[DROID] picked first class: ${classes[0].class}, lvl: ${classes[0].level}, xp: ${classes[0].xp}`)
    droid.clickWindow(1, 0, 0)
  }
}

function shuffleArray (items, weights) {
  // Stolen from: https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
  // Thanks Redwolf Programs
  let i
  for (i = 0; i < weights.length; i++) {
    weights[i] += weights[i - 1] || 0
  }
  const random = Math.random() * weights[weights.length - 1]
  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) break
  }
  return items[i]
}
