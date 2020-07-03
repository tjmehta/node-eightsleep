import MockEightAPIServer, { PORT } from './__fixtures__/MockEightAPIServer'

import Eightsleep from '../index'

const username = 'owner@email.com'
const password = 'ownerpassword'

describe('eightsleep', () => {
  const server = new MockEightAPIServer()

  beforeEach(async () => {
    await server.start()
  })

  afterEach(async () => {
    await server.stop()
  })

  it('should not login with invalid credentials', async () => {
    const e = new Eightsleep(`http://localhost:${PORT}`)
    await expect(async () => {
      await e.login(username, password + password)
    }).rejects.toThrow(/400/)
  })

  it('should login', async () => {
    const e = new Eightsleep(`http://localhost:${PORT}`)
    const session = await e.login(username, password)
    expect(session).toMatchInlineSnapshot(`
      Object {
        "expirationDate": 3020-06-30T05:40:30.880Z,
        "token": "1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef",
        "userId": "1234567890abcdef123456789011111",
      }
    `)
  })

  it('should get me', async () => {
    const e = new Eightsleep(`http://localhost:${PORT}`)
    await e.login(username, password)
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
    const e = new Eightsleep(`http://localhost:${PORT}`)
    await e.login(username, password)
    const me = await e.getDevice('200036001847373531373933')
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
    const e = new Eightsleep(`http://localhost:${PORT}`)
    await e.login(username, password)
    const me = await e.getDevice('200036001847373531373933', {
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

  it('should get owner user by id', async () => {
    const e = new Eightsleep(`http://localhost:${PORT}`)
    await e.login(username, password)
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
    const e = new Eightsleep(`http://localhost:${PORT}`)
    await e.login(username, password)
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
})
