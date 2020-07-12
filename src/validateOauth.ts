import BaseError from 'baseerr'

export type OauthSession = {
  accessToken: string
  tokenType: string
  expiresIn: Date
  refreshToken: string
}

class InvalidOauthError extends BaseError<{}> {}

export default function validateOauth(oauth: any): OauthSession {
  if (typeof oauth != 'object') {
    throw new InvalidOauthError('invalid oauth', { oauth })
  }
  let {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
    refresh_token: refreshToken,
  } = oauth
  if (typeof accessToken !== 'string')
    throw new InvalidOauthError('invalid accessToken', { oauth })
  if (typeof tokenType !== 'string')
    throw new InvalidOauthError('invalid tokenType', { oauth })
  expiresIn = new Date(expiresIn).valueOf()
  if (typeof expiresIn !== 'number' || isNaN(expiresIn))
    throw new InvalidOauthError('invalid expiresIn', { oauth })
  if (typeof refreshToken !== 'string')
    throw new InvalidOauthError('invalid refreshToken', { oauth })
  return {
    accessToken,
    tokenType,
    expiresIn: new Date(expiresIn),
    refreshToken,
  }
}
