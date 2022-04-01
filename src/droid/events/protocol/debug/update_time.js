module.exports = {
  name: 'update_time',
  enabled: true,
  once: false,
  async execute (droid) {
    try {
      await droid.wca.updateLocation()
    } catch (e) {}
  }
}
