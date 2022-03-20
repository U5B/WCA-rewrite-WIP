
module.exports = {
  name: 'fetch',
  enabled: true,
  async execute (client, env, collection, options) {
    const col = env.collection(collection)
    let dbArray
    if (!options) dbArray = await col.find({}).toArray() // fetch data
    else if (options) dbArray = await col.find(options).toArray()
    if (!dbArray) throw Error(`[MONGODB] Trying to find collection: ${collection} with options ${options}`)
    return dbArray
  }
}
