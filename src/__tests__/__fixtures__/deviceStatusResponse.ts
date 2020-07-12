import {
  CoupleDeviceStatusType,
  DeviceStatusType,
  SideStatusType,
  SoloDeviceStatusType,
} from './../../validateDeviceStatus'

import { Levels } from '../../EightSleepAppApi'
import deviceResponse from './deviceResponse'

type NullableSideStatusType =
  | {
      currentActivity?: 'off' | 'on'
      currentLevel?: number // -31
      currentTargetLevel?: Levels
      version?: number // 2
    }
  | {
      currentActivity?: 'schedule'
      currentLevel?: number // -31
      currentTargetLevel?: Levels
      smartTemperature?: {
        bedLocalTime?: string // '00:00:00'
        bedTimeLevel?: Levels
        currentPhase?: string // 'bedtime'
        finalSleepLevel?: Levels
        initialSleepLevel?: Levels
      }
      version?: number // 2
    }

let coupleDeviceStatus: DeviceStatusType = {
  left: {
    currentActivity: 'off',
    currentLevel: -29,
    currentTargetLevel: 0,
    version: 2,
  },
  right: {
    currentActivity: 'off',
    currentLevel: -33,
    currentTargetLevel: 0,
    version: 2,
  },
}

export const offSideStatus: SideStatusType = {
  currentActivity: 'off',
  currentLevel: -33,
  currentTargetLevel: 0,
  version: 2,
}

export const onSideStatus: SideStatusType = {
  currentActivity: 'on',
  currentLevel: -33,
  currentTargetLevel: 0,
  version: 2,
}

export const scheduledSideStatus: SideStatusType = {
  currentActivity: 'schedule',
  currentLevel: -31,
  currentTargetLevel: 10,
  smartTemperature: {
    bedLocalTime: '00:00:00',
    bedTimeLevel: 10,
    currentPhase: 'bedtime',
    finalSleepLevel: -10,
    initialSleepLevel: -10,
  },
  version: 2,
}

type UpdateType = {
  left?: NullableSideStatusType
  right?: NullableSideStatusType
}
export const getCoupleDeviceStatus = (
  update?: UpdateType,
): CoupleDeviceStatusType => {
  const { left, right } = update || {}
  coupleDeviceStatus = {
    ...coupleDeviceStatus,
    left: {
      // @ts-ignore this always returns left/right device
      ...coupleDeviceStatus.left,
      ...left,
    } as SideStatusType,
    right: {
      // @ts-ignore this always returns left/right device
      ...coupleDeviceStatus.right,
      ...right,
    } as SideStatusType,
  }
  return coupleDeviceStatus
}

let soloDeviceStatus: DeviceStatusType = {
  solo: {
    currentActivity: 'off',
    currentLevel: -29,
    currentTargetLevel: 0,
    version: 2,
  },
}

export const getSoloDeviceStatus = (
  solo?: NullableSideStatusType,
): SoloDeviceStatusType => {
  soloDeviceStatus = {
    ...soloDeviceStatus,
    solo: {
      // @ts-ignore this always returns solo device
      ...soloDeviceStatus.solo,
      ...solo,
    } as SideStatusType,
  }
  return soloDeviceStatus
}
