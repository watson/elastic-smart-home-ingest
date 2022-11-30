#!/usr/bin/env node
'use strict'

const netatmo = require('../src/sources/netatmo')

;(async () => {
  console.log('Starting ingest...')
  await netatmo()
  console.log('Ingestion complete!')
  process.exit() // netatmo keeps open handles :(
})()
