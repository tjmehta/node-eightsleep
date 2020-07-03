import ApiClient, { ExtendedRequestInit, setFetch } from 'simple-api-client'
import validateSession, { SessionType } from './validateSession'

import BaseError from 'baseerr'
import fetch from 'cross-fetch'
import validateDevice from './validateDevice'
import validateUser from './validateUser'

class NetworkError extends BaseError<{}> {}
class StatusCodeError extends BaseError<{ status: number; body?: string }> {}
class InvalidResponseError extends BaseError<{}> {}

setFetch(fetch)

export default class EightSleepApiClient extends ApiClient {
  auth?: {
    email: string
    password: string
  }
  session?: SessionType

  constructor(url?: string) {
    super(url || 'https://client-api.8slp.net/v1', {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'Eight%20AppStore/11 CFNetwork/808.2.16 Darwin/16.3.0',
        'accept-language': 'en-gb',
        'accept-encoding': 'gzip',
      },
    })
  }

  async fetch(url: string, init?: RequestInit) {
    const res = await super
      .fetch(url, init)
      .catch((err) => NetworkError.wrapAndThrow(err, 'network error'))
    if (res.status > 300) {
      let body: string | undefined
      try {
        body = await res.text()
      } finally {
        throw new StatusCodeError(`${res.status} error`, {
          body,
          status: res.status,
        })
      }
    }
    return res
  }

  async login(email: string, password: string) {
    if (this.auth != null && this.session != null) {
      if (this.auth.email === email && this.auth.password === password) {
        return await this.refreshToken()
      }
      // new login
      delete this.auth
      delete this.session
    }
    const res = await this.post('login', {
      json: {
        email,
        password,
      },
    })
    const json = await res
      .json()
      .catch((err: Error) =>
        InvalidResponseError.wrapAndThrow(err, 'invalid response'),
      )
    if (typeof json != 'object') {
      throw new InvalidResponseError('invalid response', { json })
    }
    this.session = validateSession(json.session)
    this.auth = {
      email,
      password,
    }
    return this.session
  }

  async refreshToken(): Promise<SessionType> {
    if (this.auth == null || this.session == null) {
      // no auth or session
      throw new BaseError('unauthorized', {
        auth: this.auth,
        session: this.session,
      })
    }
    if (this.session.expirationDate.valueOf() < Date.now() - 100) {
      // session is expired, login again
      delete this.session
      return this.login(this.auth.email, this.auth.password)
    }

    return this.session
  }

  async getMe(query?: {}) {
    return this.getUser('me', query)
  }

  async getUser(id: string, query?: {}) {
    const session = await this.refreshToken()
    const res = await this.get(`users/${id}`, {
      query,
      headers: {
        'session-token': session.token,
      },
    })
    const json = await res
      .json()
      .catch((err: Error) =>
        InvalidResponseError.wrapAndThrow(err, 'invalid response'),
      )
    if (typeof json != 'object') {
      throw new InvalidResponseError('invalid response', { json })
    }

    // @ts-ignore
    if (query?.filter) return json.result
    return validateUser(json.user)
  }

  async getDevice(id: string, query?: {}) {
    const session = await this.refreshToken()
    const res = await this.get(`devices/${id}`, {
      query,
      headers: {
        'session-token': session.token,
      },
    })
    const json = await res
      .json()
      .catch((err: Error) =>
        InvalidResponseError.wrapAndThrow(err, 'invalid response'),
      )
    if (typeof json != 'object') {
      throw new InvalidResponseError('invalid response', { json })
    }

    // @ts-ignore
    if (query?.filter) return json.result
    return validateDevice(json.result)
  }
}
