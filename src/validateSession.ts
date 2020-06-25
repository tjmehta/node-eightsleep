import BaseError from 'baseerr'

export type SessionType = {
  expirationDate: Date
  userId: string
  token: string
}

class InvalidSessionError extends BaseError<{}> {}

export default function validateSession(session: any): SessionType {
  if (typeof session != 'object') {
    throw new InvalidSessionError('invalid session', { session })
  }
  let { expirationDate, userId, token } = session
  expirationDate = new Date(expirationDate)
  if (isNaN(expirationDate.valueOf())) {
    throw new InvalidSessionError('invalid expirationDate', { session })
  }
  if (typeof userId != 'string') {
    throw new InvalidSessionError('invalid userId', { session })
  }
  if (typeof token != 'string') {
    throw new InvalidSessionError('invalid token', { session })
  }
  return {
    expirationDate,
    userId,
    token,
  }
}
