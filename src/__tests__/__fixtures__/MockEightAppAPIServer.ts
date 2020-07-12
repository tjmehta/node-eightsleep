import { IncomingMessage, Server, ServerResponse, createServer } from 'http'
import {
  getCoupleDeviceStatus,
  getSoloDeviceStatus,
  offSideStatus,
  onSideStatus,
  scheduledSideStatus,
} from './deviceStatusResponse'

import AbstractStartable from 'abstract-startable'
import { Levels } from './../../EightSleepAppApi'
import concat from 'concat-stream'

export const PORT = process.env.PORT2 || 3232

export default class MockEightAppAPIServer extends AbstractStartable {
  server: Server | undefined

  private _handleRequest(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req

    // authorized routes
    if (
      req.headers['authorization'] !==
      'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZiIsImlzcyI6ImVpZ2h0OnYxIiwiYXVkIjoiYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEiLCJzdWIiOiJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYiIsImV4cCI6MTU5NDU4ODE2OSwic2NvIjpbInJlYWRfc2xlZXAiLCJ3cml0ZV9zbGVlcCIsInJlYWRfZGV2aWNlIiwid3JpdGVfZGV2aWNlIl0sInR5cCI6ImF1dGgiLCJpYXQiOjE1OTQ1MDE3Njl9.2odxApSPTrELwtTlIRtJeek8ke96sWcbxvDGJLcgEehXeNRGIrUPnqwHLjI6gsyregEJ6wetF8qtHB7MCu_b-A'
    ) {
      res.statusCode = 401
      res.end(JSON.stringify({ status: 401, code: 'Unauthorized' }))
      return
    }

    // authorization is valid
    if (
      method === 'GET' &&
      /^\/v2\/smart_temperature\/status\/123456789012345678901234$/.test(url)
    ) {
      res.statusCode = 200
      return res.end(JSON.stringify(getCoupleDeviceStatus()))
    } else if (
      method === 'PUT' &&
      /^\/v2\/manual_temperature\/123456789012345678901234\/sides\/(left|right|solo)\/level\/-?(0|([1-9]0)|100)$/.test(
        url,
      )
    ) {
      if (/solo/.test(url)) {
        let soloDeviceStatus = getSoloDeviceStatus()
        if (soloDeviceStatus.solo.currentActivity === 'off') {
          res.statusCode = 200
          return res.end(JSON.stringify(soloDeviceStatus))
        } else {
          const currentTargetLevel = parseInt(
            url.split('/').pop(),
            10,
          ) as Levels
          soloDeviceStatus = getSoloDeviceStatus({ currentTargetLevel })
          res.statusCode = 200
          return res.end(JSON.stringify(soloDeviceStatus))
        }
      } else {
        const isLeft = /left/.test(url)
        let coupleDeviceStatus = getCoupleDeviceStatus()
        const key = isLeft ? 'left' : 'right'
        if (coupleDeviceStatus[key].currentActivity === 'off') {
          res.statusCode = 200
          return res.end(JSON.stringify(getCoupleDeviceStatus()))
        } else {
          const currentTargetLevel = parseInt(
            url.split('/').pop(),
            10,
          ) as Levels
          const update = {}
          update[key] = { currentTargetLevel }
          coupleDeviceStatus = getCoupleDeviceStatus(update)
          res.statusCode = 200
          return res.end(JSON.stringify(coupleDeviceStatus))
        }
      }
    } else if (
      method === 'PUT' &&
      /^\/v2\/manual_temperature\/123456789012345678901234\/sides\/(left|right|solo)\/toggle\/off$/.test(
        url,
      )
    ) {
      if (/solo/.test(url)) {
        let soloDeviceStatus = getSoloDeviceStatus(offSideStatus)
        res.statusCode = 200
        return res.end(JSON.stringify(soloDeviceStatus))
      } else {
        const isLeft = /left/.test(url)
        const key = isLeft ? 'left' : 'right'
        const update = {}
        update[key] = offSideStatus
        let coupleDeviceStatus = getCoupleDeviceStatus(update)
        res.statusCode = 200
        return res.end(JSON.stringify(coupleDeviceStatus))
      }
    } else if (
      method === 'PUT' &&
      /^\/v2\/manual_temperature\/123456789012345678901234\/sides\/(left|right|solo)\/toggle\/on$/.test(
        url,
      )
    ) {
      if (/solo/.test(url)) {
        let soloDeviceStatus = getSoloDeviceStatus(onSideStatus)
        res.statusCode = 200
        return res.end(JSON.stringify(soloDeviceStatus))
      } else {
        const isLeft = /left/.test(url)
        const key = isLeft ? 'left' : 'right'
        const update = {}
        update[key] = scheduledSideStatus
        let coupleDeviceStatus = getCoupleDeviceStatus(update)
        res.statusCode = 200
        return res.end(JSON.stringify(coupleDeviceStatus))
      }
    } else {
      res.statusCode = 404
      res.end()
    }
  }

  protected async _start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = (this.server = createServer(this._handleRequest))
      server.once('error', reject)
      server.listen(PORT, () => {
        server.off('error', reject)
        resolve()
      })
    })
  }

  protected async _stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()))
      delete this.server
    })
  }
}

// function filterByQuery(obj: {}, url: string): {} | null {
//   let match = url.match(/filter=([^&]*)/)
//   if (!match || !match[1]) return null
//   const keys = match[1].split(',')
//   return pick(obj, keys)
// }

function pick(obj: {}, keys: Array<string>): {} {
  return keys.reduce((out, key) => {
    out[key] = obj[key]
    return out
  }, {})
}
