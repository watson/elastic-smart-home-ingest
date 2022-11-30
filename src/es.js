'use strict'

const { Client } = require('@elastic/elasticsearch')
const config = require('./config')

module.exports = new Client({
  cloud: { id: config.ES_CLOUD_ID },
  auth: { apiKey: config.ES_API_KEY }
})
