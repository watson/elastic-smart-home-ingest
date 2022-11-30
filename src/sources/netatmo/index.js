'use strict'

const { setTimeout } = require('timers/promises')
const { config: { netatmo: config } } = require('../../config')
const es = require('../../es')
const Netatmo = require('./netatmo')

const netatmo = new Netatmo(config)

module.exports = async function ingest ({ poll = false } = {}) {
  console.log('Fetching Netatmo Weather Station data...')
  const devices = await netatmo.getStationsData()
  await ingestDevice(devices[0]) // TODO: Support multiple Weather Stations
  console.log('Sucessfully ingested all Netatmo measurements!')
  if (poll) {
    console.log(`Wating ${config.pollIntervalMinutes} minutes for new Netatmo measurements...`)
    await setTimeout(config.pollIntervalMinutes * 60 * 1000)
    await ingest()
  }
}

async function ingestDevice (device) {
  console.log(`Processing data from ${device.home_name}...`)
  for (const module of device.modules) {
    await ingestModule(device, module)
  }
}

async function ingestModule (device, module, start = null) {
  start = start ?? getNextStartDate(await getLastMeasurementTimestamp(module))

  console.log(`Fetching batch of ${config.measurementsPerBatch} measurements for ${module.module_name} starting ${start.toISOString()}...`)

  // Get batch of measurements from Netatmo
  const measurements = await netatmo.getMeasure({
    device_id: device._id,
    module_id: module._id,
    size: config.measurementsPerBatch,
    scale: 'max',
    type: module.data_type,
    date_begin: start,
    optimize: false
  })

  const measurementsInBatch = Object.keys(measurements).length

  if (measurementsInBatch === 0) {
    console.log(`No more data available for ${module.module_name}!`)
    return
  }

  // Prepare received batch of measurements for storage in Elasticsearch
  const dataset = processMeasurements(device, module, measurements)

  // Store fetched batch in Elasticsearch
  abortOnESBulkError(await es.bulk({
    refresh: true,
    operations: dataset.flatMap(doc => [{ index: { _index: config.esMeasurementsIndex } }, doc])
  }))

  // If the current batch contains exactly the requested number of measurements, there might be more waiting. If so, queue the next fetch
  if (measurementsInBatch === config.measurementsPerBatch) {
    const lastTimestamp = dataset[dataset.length - 1].timestamp
    await ingestModule(device, module, getNextStartDate(lastTimestamp))
  } else {
    console.log(`No more data available for ${module.module_name}!`)
  }
}

function processMeasurements (device, module, measurements) {
  const dataTypes = Object.entries(module.data_type)
  const dataset = []

  for (const [timestamp, values] of Object.entries(measurements)) {
    const doc = {
      timestamp: netatmoTimestampToDate(timestamp),
      home: {
        id: device.home_id,
        name: device.home_name
      },
      module: {
        id: module._id,
        name: module.module_name
      }
    }
    for (const [index, type] of dataTypes) {
      doc[type] = values[index]
    }
    dataset.push(doc)
  }

  return dataset
}

async function getLastMeasurementTimestamp (module) {
  console.log(`Finding latest recorded meaurement for ${module.module_name}...`)
  return (await es.search({
    index: config.esMeasurementsIndex,
    size: 1,
    query: {
      term: {
        'module.id.keyword': module._id
      }
    },
    sort: {
      timestamp: 'desc'
    }
  })).hits.hits[0]?._source?.timestamp
}

// Advance timestamp by 1s so we don't request the latest measurement again
function getNextStartDate (lastTimestamp = null) {
  if (lastTimestamp === null) return new Date(0)
  if (typeof lastTimestamp === 'string') lastTimestamp = new Date(lastTimestamp)
  return new Date(lastTimestamp.getTime() + 1000)
}

function abortOnESBulkError (bulkResponse) {
  if (bulkResponse.errors) {
    bulkResponse.items.forEach((item) => {
      const action = Object.keys(item)[0]
      const operation = item[action]
      if (operation.error) {
        console.error(`ES ERROR[${operation.status}]:`, operation.error)
      }
    })
    process.exit(1)
  }
}

function netatmoTimestampToDate (timestamp) {
  return new Date(parseInt(timestamp, 10) * 1000)
}
