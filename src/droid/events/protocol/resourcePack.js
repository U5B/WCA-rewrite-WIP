module.exports = {
  name: 'resourcePack',
  enabled: true,
  once: false,
  async execute (droid, url, hash) {
    droid.acceptResourcePack()
  }
}
