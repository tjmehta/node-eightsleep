import BaseError from 'baseerr'
import { Features } from './validateDevice'
import { isString } from 'util'
import isValueOf from './isValueOf'

enum Genders {
  'MALE' = 'male',
  'FEMALE' = 'female',
}

enum Sides {
  'LEFT' = 'left',
  'RIGHT' = 'right',
  'SOLO' = 'solo',
}

type UserIdType = string
type DeviceIdType = string

export type UserType = {
  userId: UserIdType
  email: string
  firstName: string
  lastName: string
  gender: Genders
  dob: Date
  zip: number
  devices: DeviceIdType[]
  emailVerified: boolean
  sharingMetricsTo: UserIdType[]
  sharingMetricsFrom: UserIdType[]
  timezone: string // 'America/Los_Angeles'
  notifications: {
    weeklyReportEmail: boolean
    sessionProcessed: boolean
  }
  features: Features[]
  currentDevice: { id: DeviceIdType; side: Sides }
}

class InvalidUserError extends BaseError<{}> {}

export default function validateUser(user: any): UserType {
  if (typeof user != 'object') {
    throw new InvalidUserError('invalid user', { user })
  }
  let {
    userId,
    email,
    firstName,
    lastName,
    gender,
    dob,
    zip,
    devices,
    emailVerified,
    sharingMetricsTo,
    sharingMetricsFrom,
    timezone,
    notifications,
    features,
    currentDevice,
  } = user
  if (typeof userId !== 'string')
    throw new InvalidUserError('invalid userId', { user })
  if (typeof email !== 'string')
    throw new InvalidUserError('invalid email', { user })
  if (typeof firstName !== 'string')
    throw new InvalidUserError('invalid firstName', { user })
  if (typeof lastName !== 'string')
    throw new InvalidUserError('invalid lastName', { user })
  if (!isValueOf(Genders)(gender))
    throw new InvalidUserError('invalid gender', { user })
  dob = new Date(dob)
  if (isNaN(dob.valueOf())) throw new InvalidUserError('invalid dob', { user })
  if (typeof zip !== 'number')
    throw new InvalidUserError('invalid zip', { user })
  if (!Array.isArray(devices))
    throw new InvalidUserError('invalid devices', { user })
  if (devices.length && !devices.every(isString))
    throw new InvalidUserError('invalid devices', { user })
  if (typeof emailVerified !== 'boolean')
    throw new InvalidUserError('invalid emailVerified', { user })
  if (!Array.isArray(sharingMetricsTo))
    throw new InvalidUserError('invalid sharingMetricsTo', { user })
  if (sharingMetricsTo.length && !sharingMetricsTo.every(isString))
    throw new InvalidUserError('invalid sharingMetricsTo', { user })
  if (!Array.isArray(sharingMetricsFrom))
    throw new InvalidUserError('invalid sharingMetricsFrom', { user })
  if (sharingMetricsFrom.length && !sharingMetricsFrom.every(isString))
    throw new InvalidUserError('invalid sharingMetricsFrom', { user })
  if (typeof timezone !== 'string')
    throw new InvalidUserError('invalid timezone', { user })
  if (typeof notifications !== 'object')
    throw new InvalidUserError('invalid notifications', { user })
  if (typeof notifications.weeklyReportEmail !== 'boolean')
    throw new InvalidUserError('invalid notifications.weeklyReportEmail', {
      user,
    })
  if (typeof notifications.sessionProcessed !== 'boolean')
    throw new InvalidUserError('invalid notifications.sessionProcessed', {
      user,
    })
  if (!Array.isArray(features))
    throw new InvalidUserError('invalid features', { user })
  if (features.length && !features.every(isValueOf(Features)))
    throw new InvalidUserError('invalid sharingMetricsFrom', { user })
  if (typeof currentDevice !== 'object')
    throw new InvalidUserError('invalid currentDevice', { user })
  if (typeof currentDevice.id !== 'string')
    throw new InvalidUserError('invalid currentDevice.id', { user })
  if (!isValueOf(Sides)(currentDevice.side))
    throw new InvalidUserError('invalid currentDevice.side', { user })

  return {
    userId,
    email,
    firstName,
    lastName,
    gender,
    dob,
    zip,
    devices,
    emailVerified,
    sharingMetricsTo,
    sharingMetricsFrom,
    timezone,
    notifications,
    features,
    currentDevice,
  }
}
