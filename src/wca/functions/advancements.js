const log = require('../../util/log.js')
const regex = require('../../util/misc/regex.js')
const { mongo } = require('../../mongo/mongo.js')

let territories = {}
let previousTerritories = {}

module.exports = {
  name: 'advancements',
  enabled: true,
  async execute (json) {
    if (json.reset === false) return
    if (json.advancementMapping[0]?.key !== 'z') return
    await log.info('[DROID] updating territories...')
    const response = await parseAdvancements(json)
    await log.info('[DROID] finished updating territories')
    return response
  }
}

async function parseAdvancements (json) {
  previousTerritories = await mongo.wca.updateTerritory()
  territories = {}
  for await (const advancement of json.advancementMapping) {
    // don't care about anything else
    const displayData = advancement?.value?.displayData
    if (!displayData || displayData.flags.hidden === 1 || displayData.flags.show_toast === 1) continue // ignore toasts or hidden tags or no data
    const title = (JSON.parse(displayData.title).text).trim() // get rid of extra whitespace
    const description = (JSON.parse(displayData.description).text).split('\n')
    if (title === '' || description === '') continue // ignore empty strings
    await setDefaults(title)
    await parseDescription(title, description)
    territories[title].hq = displayData.frameType === 1 ?? false
    if (territories[title].hq) await calculateProductionTrend(title)
  }
  await mongo.wca.updateTerritory(territories)
  return territories
}

async function setDefaults (title) {
  // defaults
  territories[title] = {
    name: title,
    guild: {
      name: 'this shouldn\'t be this',
      tag: 'ERR'
    },
    production: {
      emes: 0,
      ores: 0,
      wood: 0,
      crop: 0
    },
    storage: {
      emes: {
        current: 0,
        max: 0,
        trend: 0
      },
      ores: {
        current: 0,
        max: 0,
        trend: 0
      },
      wood: {
        current: 0,
        max: 0,
        trend: 0
      },
      crop: {
        current: 0,
        max: 0,
        trend: 0
      }
    },
    treasury: 'Mythic',
    defences: 'Mythic',
    adjacents: [],
    hq: false
  }
}

async function parseDescription (title, description) { // remove extra whitespacing
  for (let text of description) {
    if (text === '') continue // ignore empty strings
    text = text.trim()
    switch (true) {
      case regex.advancements.guild.test(text): {
        const [, guildName, guildTag] = regex.advancements.guild.exec(text)
        territories[title].guild.name = guildName
        territories[title].guild.tag = guildTag
        break
      }
      case regex.advancements.production.emes.test(text): {
        const [, number] = regex.advancements.production.emes.exec(text)
        territories[title].production.emes = Number(number)
        break
      }
      case regex.advancements.production.ores.test(text): {
        const [, number] = regex.advancements.production.ores.exec(text)
        territories[title].production.ores = Number(number)
        break
      }
      case regex.advancements.production.wood.test(text): {
        const [, number] = regex.advancements.production.wood.exec(text)
        territories[title].production.wood = Number(number)
        break
      }
      case regex.advancements.production.crop.test(text): {
        const [, number] = regex.advancements.production.crop.exec(text)
        territories[title].production.crop = Number(number)
        break
      }
      case regex.advancements.storage.emes.test(text): {
        const [, current, max] = regex.advancements.storage.emes.exec(text)
        territories[title].storage.emes.current = Number(current)
        territories[title].storage.emes.max = Number(max)
        break
      }
      case regex.advancements.storage.ores.test(text): {
        const [, current, max] = regex.advancements.storage.ores.exec(text)
        territories[title].storage.ores.current = Number(current)
        territories[title].storage.ores.max = Number(max)
        break
      }
      case regex.advancements.storage.wood.test(text): {
        const [, current, max] = regex.advancements.storage.wood.exec(text)
        territories[title].storage.wood.current = Number(current)
        territories[title].storage.wood.max = Number(max)
        break
      }
      case regex.advancements.storage.crop.test(text): {
        const [, current, max] = regex.advancements.storage.crop.exec(text)
        territories[title].storage.crop.current = Number(current)
        territories[title].storage.crop.max = Number(max)
        break
      }
      case regex.advancements.treasury.test(text): {
        const [, treasury] = regex.advancements.treasury.exec(text)
        territories[title].treasury = treasury.replace(/§./g, '')
        break
      }
      case regex.advancements.defences.test(text): {
        const [, defences] = regex.advancements.defences.exec(text)
        territories[title].defences = defences.replace(/§./g, '')
        break
      }
      case regex.advancements.adjacents.test(text): {
        const [, adjacents] = regex.advancements.adjacents.exec(text)
        territories[title].adjacents.push(adjacents.replace(/§./g, ''))
        break
      }
    }
  }
}

async function calculateProductionTrend (title) {
  if (previousTerritories === false) return
  territories[title].storage.emes.trend = territories[title].storage.emes.current - previousTerritories[title].storage.emes.current
  territories[title].storage.ores.trend = territories[title].storage.ores.current - previousTerritories[title].storage.ores.current
  territories[title].storage.wood.trend = territories[title].storage.wood.current - previousTerritories[title].storage.wood.current
  territories[title].storage.crop.trend = territories[title].storage.crop.current - previousTerritories[title].storage.crop.current
}
