const XRegExp = require('xregexp')
const regex = {}
// probably a better way to do this
regex.regexCombine = function (object) {
  // object = { a: /a/, b: /b/, c: /c/ }
  let build = ''
  for (const key in object) {
    build += `{{${key}}}|`
  }
  build = build.slice(undefined, -1) // get rid of trailing '|'
  build = `^(?:${build})$`
  // build = ^(?:{{1}}|{{2}}|{{3}})$
  return XRegExp.build(build, object)
  // return = ^(?:(?:a)|(?:b)|(?:c))$
}

regex.regexCreate = function (string) {
  if (typeof string === 'string') return XRegExp.cache(`^${string}$`)
  if (string instanceof RegExp || regex instanceof XRegExp) return XRegExp.cache(string)
  return string
}

// Restart Messages for Bungeecord (Lobby)
// https://github.com/SpigotMC/BungeeCord/blob/master/proxy/src/main/resources/messages.properties
const serverConnectionError = {
  msg1: /You're rejoining too quickly! Give us a moment to save your data\./,
  msg2: /Already connecting to this server!/
}
const serverConnectionReject = {
  server_switch_failure: /Failed to send you to target server\. So we're sending you back\./,
  connection_fallback: /Could not connect to a default or fallback server, please try again later: .*/,
  connection_error: /Could not connect to target server, you have been moved to a fallback server./,
  already_connected_server: /You are already connected to this server!/,
  already_connected_proxy: /You are already connected to this proxy!/,
  server_full: /The server is full!/,
  connect_kick: /Kicked whilst connecting to .*/
}
const worldCrash = {
  server_restart: /The world is restarting/,
  server_restart2: /World Restarting!/,
  server_crashed: /The server you were previously on went down, you have been connected to a fallback server/,
  server_closed: /Server closed/,
  proxy_disconnect: /\[Proxy\] Lost connection to server\./,
  proxy_restart: /\[Proxy\] Proxy restarting\./
}

// Regexes that are used in other regexes
regex.group = {}
regex.group.uuid4 = '(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12})' // matches uuid v4
regex.group.username = '(?<username>[0-9A-Za-z_]{1,16})' // this matches only regular usernames
regex.group.nickname = '(?<nickname>[0-9A-Za-z_\\ ]{1,20})' // this matches CHAMPION nicks and regular usernames
regex.group.world = '(?<world>(?:WC)[0-9]{1,3})' // this may need to be changed if other world prefixes are introduced
regex.group.class = '(?<class>Archer|Hunter|Warrior|Knight|Mage|Dark\\ Wizard|Assassin|Ninja|Shaman|Skyseer)' // this may need to be changed if other classes are introduced
regex.group.classShort = '(?<short_class>Ar|Hu|Wa|Kn|Ma|Da|As|Ni|Sh|Sk)' // shorthand class
regex.group.rank = '(?<rank>|★{1,5})'
regex.group.bomb = '(?<bomb>Combat\\ XP|Loot|Dungeon|Profession\\ Speed|Profession XP)'

// Regexes used in the world
regex.world = {}
regex.world.login = {}
regex.world.login.str = XRegExp(`^${regex.group.nickname} has logged into server ${regex.group.world} as an? ${regex.group.class}$`)
regex.world.login.friend = XRegExp(`^§a(?:§o)?${regex.group.nickname}§r§2 has logged into server §r§a${regex.group.world}§r§2 as §r§aan? ${regex.group.class}§r$`)
regex.world.login.guild = XRegExp(`^§b(?:§o)?${regex.group.nickname}§r§3 has logged into server §r§b${regex.group.world}§r§3 as §r§ban? ${regex.group.class}§r$`)
regex.world.restart = /The world will restart in (?:1 minute|(?:30|20|10|5|4|3|2|1) second)s?\./
regex.world.global = XRegExp(`Global \\[${regex.group.world}\\]`)
regex.world.crash = regex.regexCombine(worldCrash)

regex.world.error = {}
regex.world.error.connect = regex.regexCombine(serverConnectionReject)
regex.world.error.ignore = regex.regexCombine(serverConnectionError)

regex.lobby = {}
regex.lobby.switch = XRegExp(`^Saving your player data before switching to ${regex.group.world}\\.\\.\\.$`)
regex.lobby.rank = /You must have a HERO rank or higher to use this feature. Get one at wynncraft.com\/store/

// Kick Messages that are safe to restart from
regex.kick = {}
const serverKick = {
  timeout: /ReadTimeoutException : null/,
  connection_error: /Could not connect to a default or fallback server, please try again later: .*/
}
regex.kick.restart = regex.regexCombine(serverKick)
const serverJoin = {
  logged_in: /⚠ You are already logged on to Wynncraft./,
  lobby_full: /⚠ All lobbies are currently full./
}
regex.kick.alreadyConnected = regex.regexCombine(serverJoin)

// Advancements regexes
regex.advancements = {}
regex.advancements.guild = /^§d([\w ]+) \[(\w{3,4})\]$/
regex.advancements.production = {}
regex.advancements.production.emes = /^§7§a\+(\d+) Emeralds per Hour$/
regex.advancements.production.ores = /^§7§fⒷ \+(\d+) Ore per Hour$/
regex.advancements.production.wood = /^§7§6Ⓒ \+(\d+) Wood per Hour$/
regex.advancements.production.fish = /^§7§bⓀ \+(\d+) Fish per Hour$/
regex.advancements.production.crop = /^§7§eⒿ \+(\d+) Crops per Hour$/
regex.advancements.storage = {}
regex.advancements.storage.emes = /^§7§a(\d+)\/(\d+) stored$/
regex.advancements.storage.ores = /^§7§fⒷ (\d+)\/(\d+) stored$/
regex.advancements.storage.wood = /^§7§6Ⓒ (\d+)\/(\d+) stored$/
regex.advancements.storage.fish = /^§7§bⓀ (\d+)\/(\d+) stored$/
regex.advancements.storage.crop = /^§7§eⒿ (\d+)\/(\d+) stored$/
regex.advancements.treasury = /^§7✦ Treasury: (.+)$/
regex.advancements.defences = /^§7§7Territory Defences: (.+)$/
regex.advancements.adjacents = /^§f- §7(.+)$/

regex.selectAClass = {}
regex.selectAClass.chat = /Select a class! Each class is saved individually across all servers, you can come back at any time with \/class and select another class!/
regex.selectAClass.nickname = XRegExp(`\\[\\>\\] Select ${regex.group.nickname}$`)
regex.selectAClass.class = XRegExp(`^\\- Class: ${regex.group.class}$`)
regex.selectAClass.level = /^- Level: (\d{1,3})$/
regex.selectAClass.xp = /^- XP: (\d{1,3})%$/
regex.selectAClass.soul = /^- Soul Points: (\d{1,2})$/
regex.selectAClass.quests = /^- Finished Quests: (\d{1,3})\/(\d{1,3})$/

regex.bomb = {}
regex.bomb.bell = XRegExp(`§e\\[Bomb Bell\\] §r§f(?:§o)?${regex.group.nickname}(?:§r§f)? §r§7has thrown (?:a|an) §r§f${regex.group.bomb} Bomb §r§7on §r§f${regex.group.world}§r`)
// bomb.thrown might need to be fixed for nicks
regex.bomb.thrown = XRegExp(`§b(?:§o)?${regex.group.nickname}§r§3 has thrown (?:a|an) §r§b${regex.group.bomb} Bomb§r§3!.*`)
regex.bomb.bossBar = /(.+?) from (.+?) \[(\d+) min\]/

regex.chat = {}
regex.chat.shout = XRegExp(`§3${regex.group.username} \\[${regex.group.world}\\] shouts: §r§b(.+)§r`)

regex.guild = {}
regex.guild.chat = XRegExp(`§3\\[(?:§b)?${regex.group.rank}(?:|§3|§3§o)${regex.group.nickname}§3\\]§r§b (.+)§r`)
regex.guild.bank = XRegExp(`§3\\[INFO§3\\]§r§b §r§b${regex.group.username} (?:deposited|withdrew) (\\d{0,2})x (.{1,36})￀? (?:to|from) the Guild Bank \\((Everyone|High Ranked)\\)§r`) // Consumables have questionable character in them

const spam = {
  soulpoint: /You have \d{1,3} unused Skill Points! Right-Click while holding your compass to use them!/,
  soulpoint2: /As the sun rises, you feel a little bit safer.../,
  soulpoint3: /\[\+1 Soul Point\]/,
  info: /\[Info\] .+/

}
regex.chat.spam = regex.regexCombine(spam)
module.exports = regex
