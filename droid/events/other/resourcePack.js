module.exports = {
  name: 'resourcePack',
  once: false,
  async execute (droid, url, hash) {
    droid.acceptResourcePack()
  }
}
