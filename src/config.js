'use strict'

const Conf = require('conf')
const { prompt } = require('enquirer')
const netatmo = require('./sources/netatmo/config')

const config = new Conf()
let skip = false

module.exports = {
  _initialized: false,
  _config: {},

  get config () {
    if (!this._initialized) {
      throw new Error('Config is not ready. Please run `init` before accessing config!')
    }
    return this._config
  },

  get env () {
    return ['ES_CLOUD_ID', 'ES_API_KEY', 'NUMBER_OF_RETRIES'].concat(netatmo.map((p) => p.env))
  },

  async init (options) {
    skip = options.skip ?? false

    this._config.es = await prompt(preparePrompts([
      {
        type: 'input',
        name: 'cloudId',
        env: '',
        message: 'Elastic cloud id?'
      },
      {
        type: 'password',
        name: 'apiKey',
        env: 'ES_API_KEY',
        message: 'Elasticsearch API key?'
      }
    ], { prefix: 'es' }))

    this._config.numberOfRetries = (await prompt(preparePrompt({
      type: 'numeral',
      name: 'numberOfRetries',
      env: 'NUMBER_OF_RETRIES',
      message: 'Allowed number of ingest retries in case of failures before aborting?',
      initial: 10,
      validate (value) {
        return value < 1 ? 'Enter value larger than 1' : true
      }
    }))).numberOfRetries

    this._config.netatmo = await prompt(preparePrompts(netatmo, { prefix: 'netatmo' }))

    this._config.save = (await prompt(preparePrompt({
      type: 'confirm',
      name: 'save',
      message: 'Save answers?'
    }))).save

    this._initialized = true

    if (this._config.save) {
      config.set(this._config)
    }
  }
}

function preparePrompts (prompts, options) {
  for (const prompt of prompts) {
    preparePrompt(prompt, options)
  }
  return prompts
}

function preparePrompt (prompt, { prefix = null } = {}) {
  prompt.initial = process.env[prompt.env] ??
    (prefix ? config.store[prefix]?.[prompt.name] : config.store[prompt.name]) ??
    prompt.initial
  prompt.skip = !!(skip && prompt.initial !== undefined)

  delete prompt.env

  return prompt
}
