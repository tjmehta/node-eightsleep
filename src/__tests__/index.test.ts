import EightSleep, { OptsType } from '..'
import MockEightAppAPIServer, {
  PORT as appAPIServerPort,
} from './__fixtures__/MockEightAppAPIServer'
import MockEightClientAPIServer, {
  PORT as clientAPIServerPort,
} from './__fixtures__/MockEightClientAPIServer'

import { Sides } from './../EightSleepAppApi'

const email = process.env.EMAIL || 'owner@email.com'
const password = process.env.PASSWORD || 'ownerpassword'
const oauthClient = {
  id: process.env.OAUTH_CLIENT_ID || '1234567890abcdef1234567890123456',
  secret:
    process.env.OAUTH_CLIENT_SECRET ||
    '1234567890123456789012345678901234567890234567890123456789012345',
}

function createEightSleep(customAuth?: {
  email: OptsType['email']
  password: OptsType['password']
}) {
  const eightSleep = new EightSleep({
    email: customAuth?.email || email,
    password: customAuth?.password || password,
    // oauthClient,
  })

  if (!process.env.REAL_API) {
    // hack so request hit mock api servers
    // @ts-ignore
    eightSleep.host = `http://localhost:${clientAPIServerPort}`
    const appApi = eightSleep.getAppApiClient()
    // @ts-ignore
    appApi.host = `http://localhost:${appAPIServerPort}`
  }

  return eightSleep
}

describe('eightsleep', () => {
  const clientServer = new MockEightClientAPIServer()
  const appServer = new MockEightAppAPIServer()

  beforeEach(async () => {
    await clientServer.start()
    await appServer.start()
  })

  afterEach(async () => {
    await clientServer.stop()
    await appServer.stop()
  })

  it('should not login with invalid credentials', async () => {
    const e = createEightSleep({
      email,
      password: password + password,
    })
    await expect(async () => {
      await e.login()
    }).rejects.toMatchInlineSnapshot(`[StatusCodeError: unexpected status]`)
  })

  it('should login', async () => {
    const e = createEightSleep()
    const session = await e.login()
    expect(session).toMatchInlineSnapshot(`
      Object {
        "expirationDate": 3020-06-30T05:40:30.880Z,
        "token": "1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef",
        "userId": "1234567890abcdef123456789011111",
      }
    `)
  })

  it('should get me', async () => {
    const e = createEightSleep()
    await e.login()
    const me = await e.getMe()
    expect(me).toMatchInlineSnapshot(`
      Object {
        "currentDevice": Object {
          "id": "123456789012345678901234",
          "side": "left",
        },
        "devices": Array [
          "123456789012345678901234",
        ],
        "dob": 1900-04-01T08:34:30.000Z,
        "email": "owner@email.com",
        "emailVerified": true,
        "features": Array [
          "warming",
          "cooling",
        ],
        "firstName": "Owner",
        "gender": "male",
        "lastName": "Person",
        "notifications": Object {
          "sessionProcessed": true,
          "weeklyReportEmail": true,
        },
        "sharingMetricsFrom": Array [
          "1234567890abcdef123456789022222",
        ],
        "sharingMetricsTo": Array [
          "1234567890abcdef123456789022222",
        ],
        "timezone": "America/Los_Angeles",
        "userId": "1234567890abcdef123456789011111",
        "zip": 11111,
      }
    `)
  })

  it('should get a device', async () => {
    const e = createEightSleep()
    await e.login()
    const me = await e.getDevice('123456789012345678901234')
    expect(me).toMatchInlineSnapshot(`
      Object {
        "deviceId": "123456789012345678901234",
        "features": Array [
          "warming",
          "cooling",
        ],
        "firmwareUpdated": true,
        "firmwareUpdating": false,
        "firmwareVersion": "2.3.18.0",
        "hasWater": true,
        "hubInfo": "12345-0001-A01-AABBCCDD",
        "lastHeard": 2020-06-21T03:36:57.441Z,
        "lastLowWater": 2020-03-04T21:10:38.334Z,
        "lastPrime": 2020-03-04T21:11:23.746Z,
        "ledBrightnessLevel": 30,
        "leftHeatingDuration": 0,
        "leftHeatingLevel": -15,
        "leftKelvin": Object {
          "active": false,
          "alarms": Array [],
          "currentActivity": "off",
          "currentTargetLevel": 0,
          "level": 0,
          "scheduleProfiles": Array [
            Object {
              "enabled": true,
              "startLocalTime": "22:00:00",
              "weekDays": Object {
                "friday": true,
                "monday": true,
                "saturday": true,
                "sunday": true,
                "thursday": true,
                "tuesday": true,
                "wednesday": true,
              },
            },
          ],
          "targetLevels": Array [
            -10,
            -10,
            -20,
          ],
        },
        "leftNowHeating": false,
        "leftSchedule": Object {
          "daysUTC": Object {
            "friday": false,
            "monday": false,
            "saturday": false,
            "sunday": false,
            "thursday": false,
            "tuesday": false,
            "wednesday": false,
          },
          "durationSeconds": 0,
          "enabled": false,
          "startUTCHour": 0,
          "startUTCMinute": 0,
        },
        "leftTargetHeatingLevel": 0,
        "leftUserId": "1234567890abcdef123456789011111",
        "location": Array [
          -122.32171311,
          37.55987324,
        ],
        "mattressInfo": Object {
          "brand": null,
          "eightMattress": null,
          "firstUsedDate": null,
        },
        "needsPriming": false,
        "online": true,
        "ownerId": "1234567890abcdef123456789011111",
        "priming": false,
        "rightHeatingDuration": 3575,
        "rightHeatingLevel": 21,
        "rightKelvin": Object {
          "active": true,
          "alarms": Array [],
          "currentActivity": "schedule",
          "currentTargetLevel": 50,
          "level": 50,
          "phases": Array [
            Object {
              "active": false,
              "operation": "on",
              "position": 0,
            },
            Object {
              "active": true,
              "level": 50,
              "operation": "temperature",
              "position": 0,
            },
            Object {
              "active": false,
              "level": 10,
              "operation": "temperature",
              "position": 0.33,
            },
            Object {
              "active": false,
              "level": 30,
              "operation": "temperature",
              "position": 0.67,
            },
            Object {
              "active": false,
              "operation": "off",
              "position": 1,
            },
          ],
          "scheduleProfiles": Array [
            Object {
              "enabled": true,
              "startLocalTime": "21:30:00",
              "weekDays": Object {
                "friday": true,
                "monday": true,
                "saturday": true,
                "sunday": true,
                "thursday": true,
                "tuesday": true,
                "wednesday": true,
              },
            },
          ],
          "targetLevels": Array [
            50,
            10,
            30,
          ],
        },
        "rightNowHeating": true,
        "rightSchedule": Object {
          "daysUTC": Object {
            "friday": false,
            "monday": false,
            "saturday": false,
            "sunday": false,
            "thursday": false,
            "tuesday": false,
            "wednesday": false,
          },
          "durationSeconds": 0,
          "enabled": false,
          "startUTCHour": 0,
          "startUTCMinute": 0,
        },
        "rightTargetHeatingLevel": 50,
        "rightUserId": "1234567890abcdef123456789022222",
        "sensorInfo": Object {
          "connected": true,
          "hwRevision": "A01",
          "label": "12345-0001-A01-00000000",
          "lastConnected": 2020-06-21T03:36:57.441Z,
          "partNumber": "12345",
          "serialNumber": "00000000",
          "sku": "0001",
          "skuName": "queen",
        },
        "timezone": "America/Los_Angeles",
      }
    `)
  })

  it('should get a device', async () => {
    const e = createEightSleep()
    await e.login()
    const me = await e.getDevice('123456789012345678901234', {
      filter: 'sensorInfo',
    })
    expect(me).toMatchInlineSnapshot(`
      Object {
        "sensorInfo": Object {
          "connected": true,
          "hwRevision": "A01",
          "label": "12345-0001-A01-00000000",
          "lastConnected": "2020-06-21T03:36:57.441Z",
          "partNumber": "12345",
          "serialNumber": "00000000",
          "sku": "0001",
          "skuName": "queen",
        },
      }
    `)
  })

  it('should get a device w/ filter', async () => {
    const e = createEightSleep()
    await e.login()
    const me = await e.getMe()
    const device = await e.getDevice(me.currentDevice.id, {
      filter: 'deviceId',
    })
    expect(device).toMatchInlineSnapshot(`
      Object {
        "deviceId": "123456789012345678901234",
      }
    `)
  })

  it('should get owner user by id', async () => {
    const e = createEightSleep()
    await e.login()
    const me = await e.getUser('1234567890abcdef123456789011111')
    expect(me).toMatchInlineSnapshot(`
      Object {
        "currentDevice": Object {
          "id": "123456789012345678901234",
          "side": "left",
        },
        "devices": Array [
          "123456789012345678901234",
        ],
        "dob": 1900-04-01T08:34:30.000Z,
        "email": "owner@email.com",
        "emailVerified": true,
        "features": Array [
          "warming",
          "cooling",
        ],
        "firstName": "Owner",
        "gender": "male",
        "lastName": "Person",
        "notifications": Object {
          "sessionProcessed": true,
          "weeklyReportEmail": true,
        },
        "sharingMetricsFrom": Array [
          "1234567890abcdef123456789022222",
        ],
        "sharingMetricsTo": Array [
          "1234567890abcdef123456789022222",
        ],
        "timezone": "America/Los_Angeles",
        "userId": "1234567890abcdef123456789011111",
        "zip": 11111,
      }
    `)
  })

  it('should get partner user by id', async () => {
    const e = createEightSleep()
    await e.login()
    const me = await e.getUser('1234567890abcdef123456789022222')
    expect(me).toMatchInlineSnapshot(`
      Object {
        "currentDevice": Object {
          "id": "123456789012345678901234",
          "side": "right",
        },
        "devices": Array [
          "123456789012345678901234",
        ],
        "dob": 1900-10-26T08:34:30.000Z,
        "email": "partner@email.com",
        "emailVerified": true,
        "features": Array [
          "warming",
          "cooling",
        ],
        "firstName": "Partner",
        "gender": "female",
        "lastName": "Person",
        "notifications": Object {
          "sessionProcessed": true,
          "weeklyReportEmail": true,
        },
        "sharingMetricsFrom": Array [
          "1234567890abcdef123456789011111",
        ],
        "sharingMetricsTo": Array [
          "1234567890abcdef123456789011111",
        ],
        "timezone": "America/Los_Angeles",
        "userId": "1234567890abcdef123456789022222",
        "zip": 11111,
      }
    `)
  })

  it('should get oauth tokens', async () => {
    const e = createEightSleep()
    await e.login()
    const oauth = await e.oauth()
    expect(oauth).toMatchInlineSnapshot(`
      Object {
        "accessToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZiIsImlzcyI6ImVpZ2h0OnYxIiwiYXVkIjoiYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEiLCJzdWIiOiJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYiIsImV4cCI6MTU5NDU4ODE2OSwic2NvIjpbInJlYWRfc2xlZXAiLCJ3cml0ZV9zbGVlcCIsInJlYWRfZGV2aWNlIiwid3JpdGVfZGV2aWNlIl0sInR5cCI6ImF1dGgiLCJpYXQiOjE1OTQ1MDE3Njl9.2odxApSPTrELwtTlIRtJeek8ke96sWcbxvDGJLcgEehXeNRGIrUPnqwHLjI6gsyregEJ6wetF8qtHB7MCu_b-A",
        "expiresIn": 2020-07-11T21:10:38.035Z,
        "refreshToken": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZiIsImlzcyI6ImVpZ2h0OnYxIiwiYXVkIjoiYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEiLCJzdWIiOiJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYiIsImV4cCI6MTU5NDU4ODE2OSwic2NvIjpbInJlYWRfc2xlZXAiLCJ3cml0ZV9zbGVlcCIsInJlYWRfZGV2aWNlIiwid3JpdGVfZGV2aWNlIl0sInR5cCI6ImF1dGgiLCJpYXQiOjE1OTQ1MDE3Njl9.l3XCxV4Sy_Bbg8398p8I5a4sAgiVt8pU2gxTLRpIrlfMrf0IGeRsvIVWC4UzcWUlwfn-RwANnAJ6Y-38K7yoAA",
        "tokenType": "bearer",
      }
    `)
  })

  describe('appApi', () => {
    it('should get device status', async () => {
      const e = createEightSleep()
      await e.login()
      const appApi = e.getAppApiClient()
      const status = await appApi.getDeviceStatus('123456789012345678901234')
      expect(status).toMatchInlineSnapshot(`
        Object {
          "left": Object {
            "currentActivity": "off",
            "currentLevel": -29,
            "currentTargetLevel": 0,
            "version": 2,
          },
          "right": Object {
            "currentActivity": "off",
            "currentLevel": -33,
            "currentTargetLevel": 0,
            "version": 2,
          },
        }
      `)
    })
    it('should turn device side off', async () => {
      const e = createEightSleep()
      await e.login()
      const appApi = e.getAppApiClient()
      const status = await appApi.setDeviceSideOff(
        '123456789012345678901234',
        Sides.LEFT,
      )
      expect(status).toMatchInlineSnapshot(`
        Object {
          "left": Object {
            "currentActivity": "off",
            "currentLevel": -33,
            "currentTargetLevel": 0,
            "version": 2,
          },
          "right": Object {
            "currentActivity": "off",
            "currentLevel": -33,
            "currentTargetLevel": 0,
            "version": 2,
          },
        }
      `)
    })

    it('should turn device side on', async () => {
      const e = createEightSleep()
      await e.login()
      const appApi = e.getAppApiClient()
      const status = await appApi.setDeviceSideOn(
        '123456789012345678901234',
        Sides.LEFT,
      )
      expect(status).toMatchInlineSnapshot(`
        Object {
          "left": Object {
            "currentActivity": "schedule",
            "currentLevel": -31,
            "currentTargetLevel": 10,
            "smartTemperature": Object {
              "bedLocalTime": "00:00:00",
              "bedTimeLevel": 10,
              "currentPhase": "bedtime",
              "finalSleepLevel": -10,
              "initialSleepLevel": -10,
            },
            "version": 2,
          },
          "right": Object {
            "currentActivity": "off",
            "currentLevel": -33,
            "currentTargetLevel": 0,
            "version": 2,
          },
        }
      `)
    })

    it('should set device side temperature (while off)', async () => {
      const e = createEightSleep()
      await e.login()
      const appApi = e.getAppApiClient()
      await appApi.setDeviceSideOff('123456789012345678901234', Sides.LEFT)
      const status = await appApi.setDeviceSideLevel(
        '123456789012345678901234',
        Sides.LEFT,
        10,
      )
      expect(status).toMatchInlineSnapshot(`
        Object {
          "left": Object {
            "currentActivity": "off",
            "currentLevel": -33,
            "currentTargetLevel": 0,
            "version": 2,
          },
          "right": Object {
            "currentActivity": "off",
            "currentLevel": -33,
            "currentTargetLevel": 0,
            "version": 2,
          },
        }
      `)
    })

    it('should set device side temperature (while on)', async () => {
      const e = createEightSleep()
      await e.login()
      const appApi = e.getAppApiClient()
      await appApi.setDeviceSideOn('123456789012345678901234', Sides.LEFT)
      const status = await appApi.setDeviceSideLevel(
        '123456789012345678901234',
        Sides.LEFT,
        10,
      )
      expect(status).toMatchInlineSnapshot(`
        Object {
          "left": Object {
            "currentActivity": "schedule",
            "currentLevel": -31,
            "currentTargetLevel": 10,
            "smartTemperature": Object {
              "bedLocalTime": "00:00:00",
              "bedTimeLevel": 10,
              "currentPhase": "bedtime",
              "finalSleepLevel": -10,
              "initialSleepLevel": -10,
            },
            "version": 2,
          },
          "right": Object {
            "currentActivity": "off",
            "currentLevel": -33,
            "currentTargetLevel": 0,
            "version": 2,
          },
        }
      `)
    })

    if (process.env.REAL_API) {
      it.only('test', async () => {
        const e = createEightSleep()
        await e.login()
        const me = await e.getMe()
        const appApi = e.getAppApiClient()
        const json = await e.getDevice(me.currentDevice.id)
        // const json = await appApi.get(
        //   'v1/devices/' +
        //     me.currentDevice.id +
        //     '/metrics/ambient?granularity=minute&from=2020-07-19T10:20:59.495Z&scope=humidity&scope=roomTemperature',
        //   {
        //     headers: {
        //       'user-agent': 'Eight/786 CFNetwork/1125.2 Darwin/19.4.0',
        //       'accept-language': 'en-us',
        //       'accept-encoding': 'gzip, deflate, br',
        //       accept: 'application/json',
        //       'user-id': '1234567890abcdef123456789011111',
        //       'session-token':
        //         '1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef',
        //     },
        //   },
        // )
        console.log(JSON.stringify(json, null, 2))
      })
    }
  })
})
