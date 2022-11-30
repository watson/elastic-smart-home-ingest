'use strict'

module.exports = [
  {
    type: 'input',
    name: 'client_id',
    message: 'Netatmo client id?'
  },
  {
    type: 'password',
    name: 'client_secret',
    message: 'Netatmo client secret?'
  },
  {
    type: 'input',
    name: 'username',
    message: 'Netatmo username?'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Netatmo password?'
  },
  {
    type: 'input',
    name: 'esMeasurementsIndex',
    message: 'Elasticsearch Netatmo measurements index?',
    initial: 'netatmo-measurements'
  },
  {
    type: 'numeral',
    name: 'measurementsPerBatch',
    message: 'Netatmo Measurements Per Batch?',
    initial: 1024,
    validate (value) {
      return value < 1 || value > 1024 ? 'Enter value between 1 and 1024' : true
    }
  },
  {
    type: 'numeral',
    name: 'pollIntervalMinutes',
    message: 'Netatmo poll internval in minutes?',
    initial: 10,
    validate (value) {
      return value < 10 ? 'Enter value larger than 10' : true
    }
  }
]
