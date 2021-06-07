import ApiClient, { ExtendedRequestInit } from 'simple-api-client'

import EightSleepClientApi from './index'
import { StatusCodeError } from 'simple-api-client'
import validateDeviceStatus from './validateDeviceStatus'

export enum Sides {
  SOLO = 'solo',
  LEFT = 'left',
  RIGHT = 'right',
}

export type Levels =
  | -100
  | -90
  | -80
  | -70
  | -60
  | -50
  | -40
  | -30
  | -20
  | -10
  | 0
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 70
  | 80
  | 90
  | 100

export type OptsType = {
  clientApi: EightSleepClientApi
  defaultInit: ExtendedRequestInit
}

export class EightSleepAppApi extends ApiClient {
  private readonly clientApi: EightSleepClientApi

  constructor({ clientApi, defaultInit }: OptsType) {
    super('https://app-api.8slp.net', async (path, init) => {
      const [userId, token] = await Promise.all([
        this.userId(),
        this.oauthToken(),
      ])
      return {
        ...defaultInit,
        ...init,
        headers: {
          ...defaultInit.headers,
          'user-id': userId,
          authorization: `Bearer ${token}`,
          ...init?.headers,
        },
      }
    })
    this.clientApi = clientApi
  }

  async userId() {
    const session = await this.clientApi.login()
    return session.userId
  }

  async oauthToken() {
    const oauthSession = await this.clientApi.oauth()
    return oauthSession.accessToken
  }

  async getDeviceStatus(deviceId: string, query?: {}) {
    const path = `v2/smart_temperature/status/${deviceId}`
    const status = await this.json(path, 200, {
      query,
    })
    return validateDeviceStatus(status)
  }

  async setDeviceSideOff(deviceId: string, side: Sides, query?: {}) {
    const path = `v2/manual_temperature/${deviceId}/sides/${side}/toggle/off`
    const init = {
      method: 'PUT' as 'PUT',
      query,
    }
    const status = await this.json(path, 200, init)
    return validateDeviceStatus(status)
  }

  async setDeviceSideOn(deviceId: string, side: Sides, query?: {}) {
    const path = `v2/manual_temperature/${deviceId}/sides/${side}/toggle/on`
    const init = {
      method: 'PUT' as 'PUT',
      query,
    }
    const status = await this.json(path, 200, init)
    return validateDeviceStatus(status)
  }

  async setDeviceSideLevel(
    deviceId: string,
    side: Sides,
    level: Levels,
    query?: {},
  ) {
    const path = `v2/manual_temperature/${deviceId}/sides/${side}/level/${level}`
    const init = {
      method: 'PUT' as 'PUT',
      query,
    }
    const status = await this.json(path, 200, init)
    return validateDeviceStatus(status)
  }
}
