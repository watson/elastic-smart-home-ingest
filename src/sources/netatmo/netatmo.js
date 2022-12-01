'use strict'

const { setTimeout } = require('timers/promises')
const { EventEmitter } = require('events')
const _Netatmo = require('netatmo')

module.exports = class Netatmo extends EventEmitter {
  #lastNatatmoRequest = 0
  #client = null

  constructor (...args) {
    super()
    this.#client = new _Netatmo(...args)
    this.#client.on('warning', (err) => {
      this.emit('error', err)
    })
    this.#client.on('error', (err) => {
      this.emit('error', err)
    })
  }

  async getStationsData (...args) {
    await this.#ratelimit()
    return new Promise((resolve, reject) => {
      this.#client.getStationsData(...args, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  async getMeasure (...args) {
    await this.#ratelimit()
    return new Promise((resolve, reject) => {
      this.#client.getMeasure(...args, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  // According to https://dev.netatmo.com/guideline we're only allowed to make 500 requests/hour.
  // If we make 1 request every 7.2 seconds that will be exactly 500 requests/hour.
  async #ratelimit () {
    const now = Date.now()
    const timeSinceLastRequest = now - this.#lastNatatmoRequest
    const minTimeBetweenRequests = 7200
    const delay = Math.max(0, minTimeBetweenRequests - timeSinceLastRequest)
    await setTimeout(delay)
    this.#lastNatatmoRequest = now
  }
}
