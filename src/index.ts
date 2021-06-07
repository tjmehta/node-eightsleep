import ApiClient, {
  ExtendedRequestInit,
  QueryParamsType,
  setFetch,
} from 'simple-api-client'
import validateOauth, { OauthSession } from './validateOauth'
import validateSession, { SessionType } from './validateSession'

import BaseError from 'baseerr'
import { EightSleepAppApi } from './EightSleepAppApi'
import fetch from 'cross-fetch'
import memoizeConcurrent from 'memoize-concurrent'
import stringify from 'fast-safe-stringify'
import validateDevice from './validateDevice'
import validateUser from './validateUser'

export { Sides } from './EightSleepAppApi'

type LoginType = {
  email: string
  password: string
}
type OauthClientType = {
  id: string
  secret: string
}
export type OptsType = {
  email: string
  password: string
  oauthClient?: OauthClientType
  oauthSession?: OauthSession
  session?: SessionType
}

export {
  NetworkError,
  StatusCodeError,
  InvalidResponseError,
} from 'simple-api-client'

setFetch(fetch)

const defaultInit: ExtendedRequestInit = {
  headers: {
    'user-agent': 'Eight%20Sleep/1000018 CFNetwork/1237 Darwin/20.4.0',
    'accept-language': 'en-us',
    'accept-encoding': 'gzip, deflate, br',
  },
  backoff: {
    statusCodes: /^5..$/,
    timeouts: [100, 200],
  },
  throttle: {
    statusCodes: [429],
    timeout: 60 * 1000,
  },
}

export default class EightSleepClientApi extends ApiClient {
  private readonly auth: LoginType
  private readonly appApiClient?: EightSleepAppApi
  session?: SessionType
  oauthClient?: OauthClientType
  oauthSession?: OauthSession

  constructor({
    email,
    password,
    oauthClient,
    oauthSession,
    session,
  }: OptsType) {
    super('https://client-api.8slp.net/v1', async (path, init) => {
      // @ts-ignore
      const session = init?.json?.email == null ? await this.login() : null
      const headers = {
        ...defaultInit.headers,
        ...init?.headers,
      }
      if (session) {
        Object.assign(headers, {
          'user-id': session.userId,
          'session-token': session.token,
        })
      }
      return {
        ...init,
        ...defaultInit,
        headers,
      }
    })
    this.auth = { email, password }
    this.oauthClient = oauthClient
    if (oauthClient) {
      this.appApiClient = new EightSleepAppApi({
        clientApi: this,
        defaultInit,
      })
    }
    this.oauthSession = oauthSession
    this.session = session
  }

  toJSON(): OptsType {
    return {
      ...this.auth,
      oauthClient: this.oauthClient,
      oauthSession: this.oauthSession,
      session: this.session,
    }
  }

  login = memoizeConcurrent(
    async () => {
      if (this.session != null) return await this.refreshSession()

      const { email, password } = this.auth
      const json = await this.post('login', 200, {
        json: {
          email,
          password,
        },
      })
      this.session = validateSession(json.session)
      return this.session
    },
    {
      cacheKey: () => 'all',
    },
  )

  async refreshSession(): Promise<SessionType> {
    if (this.auth == null || this.session == null) {
      // no auth or session
      throw new BaseError('unauthorized', {
        login: this.auth,
        session: this.session,
      })
    }
    if (this.session.expirationDate.valueOf() < Date.now() - 100) {
      // session is expired, login again
      delete this.session
      return await this.login()
    }

    return this.session
  }

  oauth = memoizeConcurrent(
    async (): Promise<OauthSession> => {
      if (this.oauthClient == null) {
        throw new BaseError('missing oauth client info')
      }
      if (this.oauthSession != null) return await this.refreshOauth()

      const json = await this.post('users/oauth-token', {
        json: {
          client_id: this.oauthClient.id,
          client_secret: this.oauthClient.secret,
        },
      })

      this.oauthSession = validateOauth(json)
      return this.oauthSession
    },
  )

  getAppApiClient(): EightSleepAppApi {
    if (!this.appApiClient) {
      throw new BaseError(
        'appApiClient is missing (client should be instantiated with oauthClient)',
      )
    }
    return this.appApiClient
  }

  async refreshOauth(): Promise<OauthSession> {
    if (this.oauthClient == null) {
      throw new BaseError('missing oauth client info')
    }
    if (this.oauthSession == null) {
      // no oauth session to refresh
      throw new BaseError('unauthorized')
    }
    if (this.oauthSession.expiresIn.valueOf() < Date.now() - 100) {
      // oauth session is expired, login again
      delete this.oauthSession
      return await this.oauth()
    }

    return this.oauthSession
  }

  async getMe(query?: QueryParamsType) {
    return this.getUser('me', query)
  }

  async updateMe(json: MeUpdateType, query?: QueryParamsType) {
    const resJSON = await this.put('users/me', 200, {
      json,
      query,
    })
    // @ts-ignore
    if (query?.filter) return resJSON.result
    return validateUser(resJSON.user)
  }

  getUser = memoizeConcurrent(
    async (id: string, query?: QueryParamsType) => {
      const json = await this.get(`users/${id}`, 200, {
        query,
      })
      // @ts-ignore
      if (query?.filter) return json.result
      return validateUser(json.user)
    },
    {
      cacheKey: ([id, query]) => `${id}:${stringify(query ?? {})}`,
    },
  )

  getDevice = memoizeConcurrent(
    async (id: string, query?: QueryParamsType) => {
      const json = await this.get(`devices/${id}`, 200, {
        query,
      })
      // @ts-ignore
      if (query?.filter) return json.result
      return validateDevice(json.result)
    },
    {
      cacheKey: ([id, query]) => `${id}:${stringify(query ?? {})}`,
    },
  )
}

export type MeUpdateType = {
  firstName?: string
  lastName?: string
  gender?: string
  dob?: Date
  zip?: number | string
}
