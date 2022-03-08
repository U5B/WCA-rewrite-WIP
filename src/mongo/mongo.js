const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

const log = require('../util/log.js')
const verify = require('./verify.js')
const dataSchema = require('./format/dataSchema.js')
const discordSchema = require('./format/discordSchema.js')
const droidSchema = require('./format/droidSchema.js')

const mongo = new MongoClient(process.env.mongoUri)
const env = mongo.db(process.env.mongoDb)

async function initMongo () {
  try {
    log.log('[MONGODB] Connecting to database.')
    await mongo.connect()
    log.log('[MONGODB] Connected to database.')
    await startup()
  } catch (error) {
    await log.error(error)
    process.exit(1)
  }
}

async function startup () {
  const collectionArray = await env.listCollections({}, { nameOnly: true }).toArray()
  if (collectionArray.length === 0) await firstTime()
  await bindFunctions(mongo)
}

async function firstTime () {
  const territoryCollection = await env.createCollection('territory')
  const bombCollection = await env.createCollection('bomb')
  const discordCollection = await env.createCollection('discord')
  const droidCollection = await env.createCollection('droid')
}

async function bindFunctions () {
  mongo.wca = {}
  log.log('[MONGODB] Binding functions...')
  const functionPath = './functions'
  const functionFolder = fs.readdirSync(path.resolve(__dirname, functionPath)).filter((file) => file.endsWith('.js'))
  for (const file of functionFolder) {
    delete require.cache[require.resolve(`${functionPath}/${file}`)]
    const fun = require(`${functionPath}/${file}`)
    if (fun.enabled === false) continue
    mongo.wca[`${fun.name}`] = async function wcaMongoFunction (...args) {
      args.unshift(env)
      args.unshift(mongo)
      const value = await fun.execute(...args)
      return value
    }
    log.info(`[MONGODB] added function client.wca.${fun.name} from ${file}`)
  }
}

module.exports = { initMongo, mongo }
