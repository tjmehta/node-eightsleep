import BaseError from 'baseerr'

class InvalidDeviceError extends BaseError<{}> {}

export enum Features {
  'WARMING' = 'warming',
  'COOLING' = 'cooling',
}

export type LocationType = [number, number]

export type PhaseType =
  | {
      active: false
      operation: string
      position: number
    }
  | {
      active: true
      level: number
      operation: string // TODO: enum type
      position: number
    }

export type ScheduleType = {
  daysUTC: {
    friday: boolean
    monday: boolean
    saturday: boolean
    sunday: boolean
    thursday: boolean
    tuesday: boolean
    wednesday: boolean
  }
  durationSeconds: number
  enabled: boolean
  startUTCHour: number
  startUTCMinute: number
}

export type ScheduleProfileType = {
  enabled: boolean
  startLocalTime: string // time
  weekDays: {
    friday: boolean
    monday: boolean
    saturday: boolean
    sunday: boolean
    thursday: boolean
    tuesday: boolean
    wednesday: boolean
  }
}

export type KelvinType = {
  active: boolean
  alarms: Array<any> // TODO: type
  currentActivity: string // TODO: enum type
  currentTargetLevel: number
  level: number
  phases?: PhaseType[]
  scheduleProfiles: ScheduleProfileType[]
  targetLevels: number[] // [number, number, number]
}

export type DeviceType = {
  deviceId?: string
  features?: Features[]
  firmwareUpdated?: boolean
  firmwareUpdating?: boolean
  firmwareVersion?: string
  hasWater?: boolean
  hubInfo?: string
  lastHeard?: Date | null
  lastLowWater?: Date | null
  lastPrime?: Date | null
  ledBrightnessLevel?: number
  leftHeatingDuration?: number
  leftHeatingLevel?: number
  leftKelvin?: KelvinType
  leftNowHeating?: boolean
  leftSchedule?: ScheduleType
  leftTargetHeatingLevel?: number
  leftUserId?: string
  location?: LocationType
  mattressInfo?: {
    brand?: any | null // TODO: string?
    eightMattress?: any | null // TODO: string?
    firstUsedDate?: any | null // TODO: date?
  }
  needsPriming?: boolean
  online?: boolean
  ownerId?: string
  priming?: boolean
  rightHeatingDuration?: number
  rightHeatingLevel?: number
  rightKelvin?: KelvinType
  rightNowHeating?: true
  rightSchedule?: ScheduleType
  rightTargetHeatingLevel?: 50
  rightUserId?: string
  sensorInfo?: {
    connected?: boolean
    hwRevision?: string
    label?: string
    lastConnected?: Date | null
    partNumber?: string
    serialNumber?: string
    sku?: string
    skuName?: string
  }
  timezone?: string // timezone enum
}

export default function validateDevice(device: any): DeviceType {
  if (typeof device != 'object') {
    throw new InvalidDeviceError('invalid device', { device })
  }
  let { lastHeard, lastLowWater, lastPrime, sensorInfo } = device
  lastHeard = new Date(lastHeard)
  if (lastHeard != null && isNaN(lastHeard.valueOf())) {
    throw new InvalidDeviceError('invalid lastHeard', { device })
  }
  lastLowWater = new Date(lastLowWater)
  if (lastLowWater != null && isNaN(lastLowWater.valueOf())) {
    throw new InvalidDeviceError('invalid lastLowWater', { device })
  }
  lastPrime = new Date(lastPrime)
  if (lastPrime != null && isNaN(lastPrime.valueOf())) {
    throw new InvalidDeviceError('invalid lastPrime', { device })
  }
  sensorInfo = {
    ...sensorInfo,
    lastConnected: sensorInfo?.lastConnected
      ? new Date(sensorInfo.lastConnected)
      : null,
  }
  if (
    sensorInfo?.lastConnected != null &&
    isNaN(sensorInfo.lastConnected.valueOf())
  ) {
    throw new InvalidDeviceError('invalid sensorInfo.lastConnected', { device })
  }
  return {
    ...device,
    lastHeard,
    lastLowWater,
    lastPrime,
    sensorInfo,
  } as DeviceType
}
