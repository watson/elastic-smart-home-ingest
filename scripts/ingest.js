#!/usr/bin/env node
'use strict'

const optimist = require('optimist')
  .usage('Usage: $0 [options]')
  .alias('version', 'v')
  .alias('help', 'h')
  .alias('yes', 'y')
  .describe('help', 'show this help')
  .describe('version', 'show version')
  .describe('yes', `don't query for already configured options`)
  .describe('poll', 'continuously poll for new data')
  .default({ poll: false, yes: false })

const { argv } = optimist

if (argv.help) {
  console.log(optimist.help())
  process.exit()
}

if (argv.version) {
  const { version } = require('../package')
  console.log(`v${version}`)
  process.exit()
}

const { init: initConfig, config } = require('../src/config')

;(async () => {
  await initConfig({ skip: argv.yes })

  const netatmo = require('../src/sources/netatmo')

  console.log('Starting ingest...')
  let retries = 0
  while (true) {
    try {
      await netatmo({ poll: argv.poll })
      break
    } catch (err) {
      console.error(err.stack)
      if (retries > config.numberOfRetries) {
        console.error('The above error occurred during ingestion! Max number of retries reached, aborting...')
        process.exit(1)
      } else {
        console.error(`The above error occurred during ingestion! Retrying (${++retries}/${config.numberOfRetries})...`)
      }
    }
  }
  console.log('Ingestion complete!')
  process.exit() // netatmo keeps open handles :(
})()
