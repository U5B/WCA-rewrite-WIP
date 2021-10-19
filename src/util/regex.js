const e = {}

// These regexes ignore resets (§r) if parsing with motd

const usernameRegex = '(?<username>[0-9A-Za-z_ ]{1,19})'
const worldRegex = '(?<world>(?:WC)[0-9]{1,3})'
const classRegex = '(?<class>Archer|Hunter|Warrior|Knight|Mage|Dark Wizard|Assassin|Ninja)'
const e.world = {}
// regex for joining world
const e.world.login.string = new Regexp(`^{usernameRegex} has logged into server ${worldRegex} as an? ${classRegex}$`)
const e.world.login.motd.green = new Regexp (`§a(?:|§a§o)${usernameRegex}§2 has logged into server §a${worldRegex}§2 as §aan? ${classRegex}`)
module.exports = e
