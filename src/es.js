'use strict'

const { Client } = require('@elastic/elasticsearch')
const { config: { es: config } } = require('./config')

module.exports = new Client({
  cloud: { id: config.cloudId },
  auth: { apiKey: config.apiKey }
})
