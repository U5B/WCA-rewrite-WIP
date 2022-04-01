module.exports = {
  name: 'resourcePack',
  enabled: true,
  once: false,
  async execute (droid, url, hash) {
    await droid.wca.location('resourcePack', url)
    await droid.acceptResourcePack()
  }
}
