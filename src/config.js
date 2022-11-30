'use strict'

module.exports = Object.assign(
  {},
  require('dotenv').config()?.parsed,
  {
    ES_NETATMO_MEASUREMENTS_INDEX: 'netatmo-measurements',
    NETATMO_MEASUREMENTS_PER_BATCH: 1024,
    NETATMO_POLL_INTERVAL: 10*60*1000, // it doesn't make sense to poll with an interval smaller than 10 minutes
    WATCH_MODE: process.argv[2] === '--watch'
  }
)
