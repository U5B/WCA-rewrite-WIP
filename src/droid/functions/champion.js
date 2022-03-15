module.exports = {
  name: 'champion',
  enabled: true,
  async execute (droid, message, checkName) {
    let nicknameDetected = false
    const response = { nickname: checkName, username: checkName }
    if (!message.json.extra) return
    for (const prop of message.json.extra) {
      if (!prop.extra) continue
      const championCheck = prop.extra[0]?.hoverEvent?.value
      if (!championCheck) continue
      for (const name of championCheck) {
        if (!name?.text) continue
        switch (name.text) {
          case '\'s real username is ': {
            nicknameDetected = true
            break
          }
          case checkName: { // nickname championCheck[0]
            response.nickname = name.text
            break
          }
          default: { // username championCheck[2]
            response.username = name.text
          }
        }
      }
    }
    if (nicknameDetected === false) return { nickname: checkName, username: checkName }
    return response
  }
}
