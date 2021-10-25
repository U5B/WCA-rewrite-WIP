const XRegExp = require('xregexp')
const e = {}

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

e.world.login.error.loginEvent = XRegExp(`^(?:
You're\\ rejoining\\ too\\ quickly!\\ Give\\ us\\ a\\ moment\\ to\\ save\\ your\\ data\\.|
Already\\ connecting\\ to\\ this\\ server!
)$`, 'x')
e.world.login.error.noLoginEvent = XRegExp(`^(?:
Failed\\ to\\ send\\ you\\ to\\ target\\ server\\.\\ So\\ we're\\ sending\\ you\\ back\\.|
Could\\ not\\ connect\\ to\\ a\\ default\\ or\\ fallback\\ server,\\ please\\ try\\ again\\ later:\\ io\\.netty\\.channel\\..*|
You\ are\ already\ connected\ to\ this\ server!|
The\\ server\\ is\\ full!
)$`, 'x')

e.world.switch = XRegExp(`^Saving your player data before switching to ${worldRegex}\\.\\.\\.$`)

e.world.restart = XRegExp(`^(?:
The\\ server\\ is\\ restarting\\ in\\ (?:1|30)\\ (?:minute|second)s?\\.|
Server\\ restarting\!
)$`, 'x')

e.world.crash = XRegExp(`^(?:
The\\ server\\ you\\ were\\ previously\\ on\\ went\\ down,\\ you\\ have\\ been\\ connected\\ to\\ a\\ fallback\\ server|
Server\\ closed|
\\[Proxy\\]\\ Lost\\ connection\\ to\\ server\\.
)$`, 'x')

module.exports = e
