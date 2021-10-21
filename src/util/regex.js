const XRegExp = require('xregexp')
const e = {}

// These regexes ignore resets (§r) if parsing with motd

const usernameRegex = '(?<username>[0-9A-Za-z_\\ ]{1,19})' // this matches CHAMPION nicks and regular usernames
const worldRegex = '(?<world>(?:WC)[0-9]{1,3})' // this may need to be changed if other world prefixes are introduced
const classRegex = '(?<class>Archer|Hunter|Warrior|Knight|Mage|Dark\\ Wizard|Assassin|Ninja)' // this may need to be changed if other classes are introduced
e.world = {}
// regex for joining world
e.world.login = {}
e.world.login.string = XRegExp(`^
${usernameRegex}
\\ has\\ logged\\ into\\ server\\ 
${worldRegex}
\\ as\\ an?\\ 
${classRegex}
$`, 'x')
e.world.login.motd = {}
e.world.login.motd.green = XRegExp(`§a(?:§o)?${usernameRegex}§r§2 has logged into server §r§a${worldRegex}§r§2 as §r§aan? ${classRegex}§r`)
e.world.login.motd.blue = XRegExp(`§b(?:§o)?${usernameRegex}§r§3 has logged into server §r§b${worldRegex}§r§3 as §r§ban? ${classRegex}§r`)
module.exports = e
