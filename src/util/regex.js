const XRegExp = require('xregexp')
const e = {}

// probably a better way to do this
function regexCombine (object) {
  // object = { a: /a/, b: /b/, c: /c/ }
  let build = ''
  for (const key in object) {
    build += `{{${key}}}|`
  }
  build = build.slice(undefined,-1) // get rid of trailing '|'
  build = `^(?:${build})$`
  // build = ^(?:{{1}}|{{2}}|{{3}})$
  return XRegExp.build(build, object)
  // return = ^(?:(?:a)|(?:b)|(?:c))$
}

const usernameRegex = '(?<username>[0-9A-Za-z_\\ ]{1,19})' // this matches CHAMPION nicks and regular usernames
const worldRegex = '(?<world>(?:WC)[0-9]{1,3})' // this may need to be changed if other world prefixes are introduced
const classRegex = '(?<class>Archer|Hunter|Warrior|Knight|Mage|Dark\\ Wizard|Assassin|Ninja)' // this may need to be changed if other classes are introduced

e.world = {}
// regex for joining world
e.world.login = {}
e.world.login.str = XRegExp(`^${usernameRegex} has logged into server ${worldRegex} as an? ${classRegex}$`)
e.world.login.friend = XRegExp(`^§a(?:§o)?${usernameRegex}§r§2 has logged into server §r§a${worldRegex}§r§2 as §r§aan? ${classRegex}§r$`)
e.world.login.guild = XRegExp(`^§b(?:§o)?${usernameRegex}§r§3 has logged into server §r§b${worldRegex}§r§3 as §r§ban? ${classRegex}§r$`)
e.world.restart = /The server is restarting in (?:1|30) (?:minute|second)s?\./
const worldCrash = {
  server_restart: /Server restarting!/,
  server_crashed: /The server you were previously on went down, you have been connected to a fallback server
  server_closed: /Server closed/,
  proxy_disconnect: /\[Proxy\] Lost connection to server\./,
  proxy_restart: /\[Proxy\] Proxy restarting\./
}
e.world.crash = regexCombine(worldCrash)

e.lobby = {}
e.lobby.switch = XRegExp(`^Saving your player data before switching to ${worldRegex}\\.\\.\\.$`)
const serverConnectionReject = {
  server_switch_failure: /Failed to send you to target server\. So we're sending you back\./,
  connection_fallback: /Could not connect to a default or fallback server, please try again later: .*/,
  connection_error: /Could not connect to target server, you have been moved to a fallback server./,
  already_connected_server: /You are already connected to this server!/,
  already_connected_proxy: /You are already connected to this proxy!/,
  server_full: /The server is full!/,
  connect_kick: /Kicked whilst connecting to .*/,
}
e.lobby.error.connect = regexCombine(serverConnectionError)

const serverConnectionError = {
  msg1: /You're rejoining too quickly! Give us a moment to save your data\./,
  msg2: /Already connecting to this server!/
}
e.world.error.ignore = regexCombine(serverDataError)

module.exports = e
// https://github.com/SpigotMC/BungeeCord/blob/master/proxy/src/main/resources/messages.properties
