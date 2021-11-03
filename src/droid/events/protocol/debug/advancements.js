const log = require('../../../../util/log')
const regex = require('../../../../util/regex.js')

let territory = {}
let previousTerritory = {}
module.exports = {
  name: 'advancements',
  enabled: true,
  once: false,
  async execute (droid, json) {
    if (json.advancementMapping[0].key !== 'z') return
    if (json.reset === true) previousTerritory = territory
    territory = {}
    for (const uwu of json.advancementMapping) {
      // don't care about anything else
      const displayData = uwu.value.displayData
      if (!displayData || displayData.flags.hidden === 1 || displayData.flags.show_toast === 1) continue // ignore toasts or hidden tags or no data
      const title = JSON.parse(displayData.title).text
      const description = JSON.parse(displayData.description).text
      if (title === '' || description === '') continue // ignore empty strings
      await parseDescription(title, description)
      territory[title].hq = displayData.frameType === 1 ?? false
    }
  }
}

async function parseDescription (title, description) {
  title = title.trim() // remove extra whitespacing
  territory[title] = {}
  territory[title].guild = {}
  territory[title].production = {}
  territory[title].storage = {}
  territory[title].storage.emes = {}
  territory[title].storage.ores = {}
  territory[title].storage.wood = {}
  territory[title].storage.crop = {}
  description = description.split('\n') // get content between newlines
  for (let text of description) {
    if (text === '') continue // ignore empty strings
    text = text.trim()
    switch (true) {
      case regex.advancements.guild.test(text): {
        const [, guildName, guildTag] = regex.advancements.guild.exec(text)
        territory[title].guild.name = guildName
        territory[title].guild.tag = guildTag
        break
      }
      case regex.advancements.production.emes.test(text): {
        const [, number] = regex.advancements.production.emes.exec(text)
        territory[title].production.emes = number
        break
      }
      case regex.advancements.production.ores.test(text): {
        const [, number] = regex.advancements.production.ores.exec(text)
        territory[title].production.ores = number
        break
      }
      case regex.advancements.production.wood.test(text): {
        const [, number] = regex.advancements.production.wood.exec(text)
        territory[title].production.wood = number
        break
      }
      case regex.advancements.production.crop.test(text): {
        const [, number] = regex.advancements.production.crop.exec(text)
        territory[title].production.crop = number
        break
      }
      case regex.advancements.storage.emes.test(text): {
        const [, current, max] = regex.advancements.storage.emes.exec(text)
        territory[title].storage.emes.current = current
        territory[title].storage.emes.max = max
        break
      }
      case regex.advancements.storage.ores.test(text): {
        const [, current, max] = regex.advancements.storage.ores.exec(text)
        territory[title].storage.ores.current = current
        territory[title].storage.ores.max = max
        break
      }
      case regex.advancements.storage.wood.test(text): {
        const [, current, max] = regex.advancements.storage.wood.exec(text)
        territory[title].storage.wood.current = current
        territory[title].storage.wood.max = max
        break
      }
      case regex.advancements.storage.crop.test(text): {
        const [, current, max] = regex.advancements.storage.crop.exec(text)
        territory[title].storage.crop.current = current
        territory[title].storage.crop.max = max
        break
      }
      case regex.advancements.treasury.test(text): {
        const [, treasury] = regex.advancements.treasury.exec(text)
        territory[title].treasury = treasury.toString()
        break
      }
      case regex.advancements.defences.test(text): {
        const [, defences] = regex.advancements.defences.exec(text)
        territory[title].defences = defences.toString()
        break
      }
    }
  }
}
