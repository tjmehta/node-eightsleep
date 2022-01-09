import BaseError from 'baseerr'
import { Levels } from './EightSleepAppApi'
import { getSoloDeviceStatus } from './__tests__/__fixtures__/deviceStatusResponse'

export type SideStatusType =
  | {
      currentActivity: 'off' | 'on'
      currentLevel: number // -31
      currentTargetLevel: Levels
      version: number // 2
    }
  | {
      currentActivity: 'schedule'
      currentLevel: number // -31
      currentTargetLevel: Levels
      smartTemperature: {
        bedLocalTime: string // '00:00:00'
        bedTimeLevel: Levels
        currentPhase: string // 'bedtime'
        finalSleepLevel: Levels
        initialSleepLevel: Levels
      }
      version: number // 2
    }

export type CoupleDeviceStatusType = {
  left: SideStatusType
  right: SideStatusType
}
export type SoloDeviceStatusType = {
  solo: SideStatusType
}
export type DeviceStatusType = CoupleDeviceStatusType | SoloDeviceStatusType

class InvalidDeviceStatusError extends BaseError<{}> {}

export default function validateDeviceStatus(
  deviceStatus: any,
): DeviceStatusType {
  if (typeof deviceStatus != 'object') {
    throw new InvalidDeviceStatusError('invalid device status', {
      deviceStatus,
    })
  }
  const { left, right, solo } = deviceStatus

  if (solo) {
    return { solo: validateSideStatus(solo) } as SoloDeviceStatusType
  }
  return {
    left: validateSideStatus(left),
    right: validateSideStatus(right),
  } as CoupleDeviceStatusType
}

class InvalidSideStatusError extends BaseError<{}> {}

export function validateSideStatus(sideStatus: any): SideStatusType {
  if (typeof sideStatus != 'object') {
    throw new InvalidSideStatusError('invalid side status', { sideStatus })
  }
  const {
    currentActivity,
    currentLevel,
    currentTargetLevel,
    version,
  } = sideStatus
  if (typeof currentActivity !== 'string')
    throw new InvalidSideStatusError('invalid currentActivity', { sideStatus })
  if (typeof currentLevel !== 'number')
    throw new InvalidSideStatusError('invalid currentLevel', { sideStatus })
  if (
    typeof currentTargetLevel !== 'number' ||
    !/^-?(0|([1-9][0-9])|100)$/.test(currentTargetLevel.toString())
  ) {
    throw new InvalidSideStatusError('invalid currentTargetLevel', {
      sideStatus,
    })
  }
  if (typeof version !== 'number')
    throw new InvalidSideStatusError('invalid version', { sideStatus })
  if (currentActivity === 'off' || currentActivity === 'on') {
    return {
      currentActivity,
      currentLevel,
      currentTargetLevel: currentTargetLevel as Levels,
      version,
    }
  } else {
    const { smartTemperature } = sideStatus
    return {
      currentActivity: currentActivity as 'schedule',
      currentLevel,
      currentTargetLevel: currentTargetLevel as Levels,
      smartTemperature,
      version,
    }
  }
}
