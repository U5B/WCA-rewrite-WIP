const e = {}

const e.world = {}
// regex for joining world
e.world.join = /^(?<username>[0-9A-Za-z_\ ]{1,19}) has logged into server (?<world>(?:WC)[0-9]{1,3}) as an? (?<class>Archer|Hunter|Warrior|Knight|Mage|Dark Wizard|Assassin|Ninja)À?$/
module.exports = e
