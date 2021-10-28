const XRegExp = require('xregexp')

// probably a better way to do this
function regexCombine (object) {
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

const regex = {}
regex.regex = {}
regex.regex.username = '(?<username>[0-9A-Za-z_\\ ]{1,20})' // this matches CHAMPION nicks and regular usernames
regex.regex.world = '(?<world>(?:WC)[0-9]{1,3})' // this may need to be changed if other world prefixes are introduced
regex.regex.class = '(?<class>Archer|Hunter|Warrior|Knight|Mage|Dark\\ Wizard|Assassin|Ninja)' // this may need to be changed if other classes are introduced

regex.world = {}
// regex for joining world
regex.world.login = {}
regex.world.login.str = XRegExp(`^${regex.regex.username} has logged into server ${regex.regex.world} as an? ${regex.regex.class}$`)
regex.world.login.friend = XRegExp(`^§a(?:§o)?${regex.regex.username}§r§2 has logged into server §r§a${regex.regex.world}§r§2 as §r§aan? ${regex.regex.class}§r$`)
regex.world.login.guild = XRegExp(`^§b(?:§o)?${regex.regex.username}§r§3 has logged into server §r§b${regex.regex.world}§r§3 as §r§ban? ${regex.regex.class}§r$`)
regex.world.restart = /The server is restarting in (?:1|30) (?:minute|second)s?\./

const worldCrash = {
  server_restart: /Server restarting!/,
  server_crashed: /The server you were previously on went down, you have been connected to a fallback server/,
  server_closed: /Server closed/,
  proxy_disconnect: /\[Proxy\] Lost connection to server\./,
  proxy_restart: /\[Proxy\] Proxy restarting\./
}
regex.world.crash = regexCombine(worldCrash)

regex.lobby = {}
regex.lobby.switch = XRegExp(`^Saving your player data before switching to ${regex.regex.world}\\.\\.\\.$`)
const serverConnectionReject = {
  server_switch_failure: /Failed to send you to target server\. So we're sending you back\./,
  connection_fallback: /Could not connect to a default or fallback server, please try again later: .*/,
  connection_error: /Could not connect to target server, you have been moved to a fallback server./,
  already_connected_server: /You are already connected to this server!/,
  already_connected_proxy: /You are already connected to this proxy!/,
  server_full: /The server is full!/,
  connect_kick: /Kicked whilst connecting to .*/
}
regex.lobby.error.connect = regexCombine(serverConnectionReject)

const serverConnectionError = {
  msg1: /You're rejoining too quickly! Give us a moment to save your data\./,
  msg2: /Already connecting to this server!/
}
regex.world.error.ignore = regexCombine(serverConnectionError)

module.exports = regex
// https://github.com/SpigotMC/BungeeCord/blob/master/proxy/src/main/resources/messages.properties
