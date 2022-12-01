#!/usr/bin/env node
'use strict'

const optimist = require('optimist')
  .usage('Usage: $0 [options]')
  .alias('version', 'v')
  .alias('help', 'h')
  .alias('yes', 'y')
  .describe('help', 'show this help')
  .describe('version', 'show version')
  .describe('yes', 'don\'t query for already configured options')
  .describe('poll', 'continuously poll for new data')
  .describe('show-env', 'list all supported environment variables')
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

const conf = require('../src/config')

if (argv['show-env']) {
  console.log(conf.env.join('\n'))
  process.exit()
}

;(async () => {
  await conf.init({ skip: argv.yes })

  const netatmo = require('../src/sources/netatmo')

  console.log('Starting ingest...')
  let retries = 0
  while (true) {
    try {
      await netatmo({ poll: argv.poll })
      break
    } catch (err) {
      console.error(err.stack)
      if (retries > conf.config.numberOfRetries) {
        console.error('The above error occurred during ingestion! Max number of retries reached, aborting...')
        process.exit(1)
      } else {
        console.error(`The above error occurred during ingestion! Retrying (${++retries}/${conf.config.numberOfRetries})...`)
      }
    }
  }
  console.log('Ingestion complete!')
  process.exit() // netatmo keeps open handles :(
})()
