const regex = require('./regex.js')
const ChatMessage = require('prismarine-chat')

const uwu = regex.world.login.string
console.log(regex.world.login.string.exec('U5B has logged into server WC69 as an Archer'))
