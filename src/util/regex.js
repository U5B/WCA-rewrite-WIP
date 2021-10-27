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

e.world.login.error = {}

const errorLoginEvent = {
  msg1: /You're rejoining too quickly! Give us a moment to save your data\./,
  msg2: /Already connecting to this server!/
}
e.world.login.error.loginEvent = regexCombine(errorLoginEvent)

const errorNoLoginEvent = {
  msg1: /Failed to send you to target server\. So we're sending you back\./,
  msg2: /Could not connect to a default or fallback server, please try again later: .*/,
  msg3: /You are already connected to this server!/,
  msg4: /The server is full!/
}
e.world.login.error.noLoginEvent = regexCombine(errorNoLoginEvent)

e.world.switch = XRegExp(`^Saving your player data before switching to ${worldRegex}\\.\\.\\.$`)

const worldRestart = {
  msg1: /The server is restarting in (?:1|30) (?:minute|second)s?\./,
  msg2: /Server restarting!/
}
e.world.restart = regexCombine(worldRestart)

const worldCrash = {
  msg1: /The server you were previously on went down, you have been connected to a fallback server/,
  msg2: /Server closed/,
  msg3: /\[Proxy\] Lost connection to server\./
}
e.world.crash = regexCombine(worldCrash)

module.exports = e
