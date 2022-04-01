const { mongo } = require('../../../mongo/mongo.js')
const { discord } = require('../../discord.js')

module.exports = {
  name: 'bomb',
  description: 'DO YOU LOVE EXPLOSIONS?!',
  type: 'CHAT_INPUT',
  options: [],
  defaultPermission: false,
  permissions: [
    {
      id: discord.application.owner.id,
      type: 'USER',
      permission: true
    }
  ],
  extra: {},
  async execute (client, interaction, args) {
    const bombs = await mongo.wca.fetch('bomb')
    const bombNumbers = {
      'Combat XP': 0,
      Dungeon: 0,
      Loot: 0,
      'Profession Speed': 0,
      'Profession XP': 0
    }
    for (const bomb of bombs) {
      bombNumbers['Combat XP'] += bomb['Combat XP']
      bombNumbers.Dungeon += bomb.Dungeon
      bombNumbers.Loot += bomb.Loot
      bombNumbers['Profession Speed'] += bomb['Profession Speed']
      bombNumbers['Profession XP'] += bomb['Profession XP']
    }
    await interaction.editReply(`**ALLTIME BOMB COUNT**\nCombat XP: ${bombNumbers['Combat XP']}\nDungeon: ${bombNumbers.Dungeon}\nLoot: ${bombNumbers.Loot}\nProfession Speed: ${bombNumbers['Profession Speed']}\nProfession XP: ${bombNumbers['Profession XP']}`)
  }
}
