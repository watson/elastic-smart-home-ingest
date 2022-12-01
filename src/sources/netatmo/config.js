'use strict'

module.exports = [
  {
    type: 'input',
    name: 'client_id',
    env: 'NETATMO_CLIENT_ID',
    message: 'Netatmo client id?'
  },
  {
    type: 'password',
    name: 'client_secret',
    env: 'NETATMO_CLIENT_SECRET',
    message: 'Netatmo client secret?'
  },
  {
    type: 'input',
    name: 'username',
    env: 'NETATMO_USERNAME',
    message: 'Netatmo username?'
  },
  {
    type: 'password',
    name: 'password',
    env: 'NETATMO_PASSWORD',
    message: 'Netatmo password?'
  },
  {
    type: 'input',
    name: 'esMeasurementsIndex',
    env: 'NETATMO_ES_MEASUREMENTS_INDEX',
    message: 'Elasticsearch Netatmo measurements index?',
    initial: 'netatmo-measurements'
  },
  {
    type: 'numeral',
    name: 'measurementsPerBatch',
    env: 'NETATMO_MEASUREMENTS_PER_BATCH',
    message: 'Netatmo Measurements Per Batch?',
    initial: 1024,
    validate (value) {
      return value < 1 || value > 1024 ? 'Enter value between 1 and 1024' : true
    }
  },
  {
    type: 'numeral',
    name: 'pollIntervalMinutes',
    env: 'NETATMO_POLL_INTERVAL_MINUTES',
    message: 'Netatmo poll internval in minutes?',
    initial: 10,
    validate (value) {
      return value < 10 ? 'Enter value larger than 10' : true
    }
  }
]
