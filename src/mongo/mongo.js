const log = require('../util/log.js')
const format = require('./format.js')

const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.mongoUri)

const dbName = 'test'
async function connectMongo () {
  try {
    console.log('[MONGODB] Connecting to database.')
    await client.connect()
    console.log('[MONGODB] Connected to database.')
    startup()
  } catch (error) {
    console.error(error)
  }
}
async function startup () {
  const env = client.db(dbName)
  const collectionArray = await env.listCollections({}, { nameOnly: true }).toArray()
  if (collectionArray.length === 0) return await firstTime()
}
async function firstTime () {
  const env = client.db(dbName)
  const discordCollection = await env.createCollection('discord')
  discordCollection.insertOne(format.discord)
  const droidCollection = await env.createCollection('droid')
  droidCollection.insertOne(format.droid)
  const dataCollection = await env.createCollection('data')
  dataCollection.insertOne(format.data)
}
module.exports = { connectMongo }
