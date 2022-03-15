# WCA-rewrite
A Wynncraft chat archiver. Records in-game chat.


### Features
* Logging chat to Discord and to a file
* QOL Mitigations:
  * These are used to prevent this program from taking up a player slot for boosters and other events. 
  * Current mitigations are:
    * booster is thrown on current world
    * booster is detected on current world
    * server restart


### TODO
* interaction modes:  
  * level 0 interactions: no chat, no commands sent, just use `/toggle autojoin`
  * level 1 interactions: interact with class menu, lobby compass menu
  * level 2 interactions: interact to leave from servers with bombs, restarting servers, full servers
  * level 3 interactions: chat bridge mode (Discord => Minecraft chat)
  * level 4 interactions: auto respond to duel requests, trade requests, housing, private messages
* more event logging such as global annoucements
* /joinsky command (automatically joins a specifc player)
* avoid worlds when a player mentions them in a shout
* more guild logging (bank, war, territory)
* host 24/7 housing


## Credits

### Notable [Node.js](https://nodejs.org/) Packages used
| Package | Description |
| --- | --- |
| [axios](https://github.com/axios/axios) | web-request library |
| [chalk](https://github.com/chalk/chalk) | wow colors |
| [debug](https://github.com/debug-js/debug) | logging |
| [discord.js](https://github.com/discordjs/discord.js/) | discord |
| [dotenv](https://github.com/motdotla/dotenv) | enviromental variables |
| [easytimer.js](https://github.com/albert-gonzalez/easytimer.js/) | timers |
| [mineflayer](https://github.com/prismarinejs/mineflayer) | high-level minecraft protocol with physics and chat |
| [mojang-minecraft-api](https://github.com/DaanKorver/mojang-minecraft-api) | mojang api |
| [mongodb](https://github.com/mongodb/node-mongodb-native) | database |
| [objectmodel](https://github.com/sylvainpolletvillard/ObjectModel) | database schema |
| [xregexp](https://github.com/slevithan/xregexp) | better regex |

### External Services used:
* [Wynntils API](https://github.com/wynntils/athena)
* [Wynncraft API](https://github.com/Wynncraft/WynncraftAPI)
* [Mojang API](https://wiki.vg/Mojang_API)


## FAQ

### How to install?
You are on your own if you try and use this program.
### Does this give you an advantage?
Yes, it does give you an advantage. This program gives an advantage by logging chat to discord, and allowing you to chat in-game without being on the server.
### Is this is an unfair advantage?
According to Wynncraft, yes. However I don't believe so. This program acts the same as a vanilla client, and does not give any gameplay advantage. It does not move, and is basically an AFK player.