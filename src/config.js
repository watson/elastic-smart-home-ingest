'use strict'

const Conf = require('conf')
const { prompt } = require('enquirer')
const netatmo = require('./sources/netatmo/config')

const config = new Conf()
let skip = false

exports.config = {};

exports.init = async function (options) {
  skip = options.skip ?? false

  exports.config.es = await prompt(preparePrompts([
    {
      type: 'input',
      name: 'cloudId',
      message: 'Elastic cloud id?'
    },
    {
      type: 'password',
      name: 'apiKey',
      message: 'Elasticsearch API key?'
    }
  ], { prefix: 'es' }))

  exports.config.netatmo = await prompt(preparePrompts(netatmo, { prefix: 'netatmo' }))

  exports.config.save = (await prompt(preparePrompt({
    type: 'confirm',
    name: 'save',
    message: 'Save answers?',
  }))).save

  if (exports.config.save) {
    config.set(exports.config)
  }
}

function preparePrompts (prompts, options) {
  for (const prompt of prompts) {
    preparePrompt(prompt, options)
  }
  return prompts
}

function preparePrompt (prompt, { prefix = null } = {}) {
  prompt.initial = (prefix ? config.store[prefix]?.[prompt.name] : config.store[prompt.name]) ?? prompt.initial
  prompt.skip = skip && prompt.initial !== undefined ? true : false
  return prompt
}