# eightsleep

Eightsleep api client for Node.js

# Installation

```sh
npm i --save eightsleep
```

# Usage

#### Supports both ESM and CommonJS

```js
// esm
import Eightsleep from 'eightsleep'
// commonjs
const Eightsleep = require('eightsleep')
```

#### Login Example

```js
import Eightsleep from 'eightsleep'

const eightsleep = new Eightsleep()

const session = await eightsleep.login()
/*
{
  "expirationDate": 2020-06-30T05:40:30.880Z,
  "token": "1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef",
  "userId": "1234567890abcdef123456789011111",
}
*/
```

#### Get Me and Get User Example

```js
import Eightsleep from 'eightsleep'

const eightsleep = new Eightsleep()
await eightsleep.login()

const me = await eightsleep.getMe()
/*
{
  "currentDevice": {
    "id": "123456789012345678901234",
    "side": "left",
  },
  "devices": [
    "123456789012345678901234",
  ],
  "dob": 1900-04-01T08:34:30.000Z,
  "email": "owner@email.com",
  "emailVerified": true,
  "features": [
    "warming",
    "cooling",
  ],
  "firstName": "Owner",
  "gender": "male",
  "lastName": "Person",
  "notifications": {
    "sessionProcessed": true,
    "weeklyReportEmail": true,
  },
  "sharingMetricsFrom": [
    "1234567890abcdef123456789022222",
  ],
  "sharingMetricsTo": [
    "1234567890abcdef123456789022222",
  ],
  "timezone": "America/Los_Angeles",
  "userId": "1234567890abcdef123456789011111",
  "zip": 11111,
}
*/
const user = await eightsleep.getUser('1234567890abcdef123456789022222')
/*
{
  "currentDevice": {
    "id": "123456789012345678901234",
    "side": "right",
  },
  "devices": [
    "123456789012345678901234",
  ],
  "dob": 1900-10-26T08:34:30.000Z,
  "email": "partner@email.com",
  "emailVerified": true,
  "features": [
    "warming",
    "cooling",
  ],
  "firstName": "Partner",
  "gender": "female",
  "lastName": "Person",
  "notifications": {
    "sessionProcessed": true,
    "weeklyReportEmail": true,
  },
  "sharingMetricsFrom": [
    "1234567890abcdef123456789011111",
  ],
  "sharingMetricsTo": [
    "1234567890abcdef123456789011111",
  ],
  "timezone": "America/Los_Angeles",
  "userId": "1234567890abcdef123456789022222",
  "zip": 11111,
}
*/
```

#### Get Device Example

```js
import Eightsleep from 'eightsleep'

const eightsleep = new Eightsleep()
await eightsleep.login()

const me = await eightsleep.getMe()
const deviceId = me.currentDevice.id

const device = await eightsleep.getDevice(deviceId)
/*
{
  "deviceId": "123456789012345678901234",
  "features": [
    "warming",
    "cooling",
  ],
  "firmwareUpdated": true,
  "firmwareUpdating": false,
  "firmwareVersion": "2.3.18.0",
  "hasWater": true,
  "hubInfo": "12345-0001-A01-AABBCCDD",
  "lastHeard": "2020-06-21T03:36:57.441Z",
  "lastLowWater": "2020-03-04T21:10:38.334Z",
  "lastPrime": "2020-03-04T21:11:23.746Z",
  "ledBrightnessLevel": 30,
  "leftHeatingDuration": 0,
  "leftHeatingLevel": -15,
  "leftKelvin": {
    "active": false,
    "alarms": [],
    "currentActivity": "off",
    "currentTargetLevel": 0,
    "level": 0,
    "scheduleProfiles": [
      {
        "enabled": true,
        "startLocalTime": "22:00:00",
        "weekDays": {
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
    "targetLevels": [
      -10,
      -10,
      -20,
    ],
  },
  "leftNowHeating": false,
  "leftSchedule": {
    "daysUTC": {
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
  "location": [
    -122.32171311,
    37.55987324,
  ],
  "mattressInfo": {
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
  "rightKelvin": {
    "active": true,
    "alarms": [],
    "currentActivity": "schedule",
    "currentTargetLevel": 50,
    "level": 50,
    "phases": [
      {
        "active": false,
        "operation": "on",
        "position": 0,
      },
      {
        "active": true,
        "level": 50,
        "operation": "temperature",
        "position": 0,
      },
      {
        "active": false,
        "level": 10,
        "operation": "temperature",
        "position": 0.33,
      },
      {
        "active": false,
        "level": 30,
        "operation": "temperature",
        "position": 0.67,
      },
      {
        "active": false,
        "operation": "off",
        "position": 1,
      },
    ],
    "scheduleProfiles": [
      {
        "enabled": true,
        "startLocalTime": "21:30:00",
        "weekDays": {
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
    "targetLevels": [
      50,
      10,
      30,
    ],
  },
  "rightNowHeating": true,
  "rightSchedule": {
    "daysUTC": {
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
  "sensorInfo": {
    "connected": true,
    "hwRevision": "A01",
    "label": "12345-0001-A01-00000000",
    "lastConnected": "2020-06-21T03:36:57.441Z",
    "partNumber": "12345",
    "serialNumber": "00000000",
    "sku": "0001",
    "skuName": "queen",
  },
  "timezone": "America/Los_Angeles",
}
*/
```

# License

MIT
