import { IncomingMessage, Server, ServerResponse, createServer } from 'http'

import AbstractStartable from 'abstract-startable'
import concat from 'concat-stream'
import deviceResponse from './deviceResponse'
import ownerUserResponse from './ownerUserResponse'
import partnerUserResponse from './partnerUserResponse'

export const PORT = process.env.PORT || 3131

export default class MockEightAPIServer extends AbstractStartable {
  server: Server | undefined

  private _handleRequest(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req
    if (method === 'POST' && /^\/login/.test(url)) {
      req.pipe(
        concat((body) => {
          const { email, password } = JSON.parse(body.toString())
          if (email === 'owner@email.com' && password === 'ownerpassword') {
            res.statusCode = 200
            res.end(
              JSON.stringify({
                session: {
                  expirationDate: '3020-06-30T05:40:30.880Z',
                  userId: '1234567890abcdef123456789011111',
                  token:
                    '1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef',
                },
              }),
            )
          } else {
            res.statusCode = 400
            res.end(
              JSON.stringify({
                status: 400,
                code: 'BadRequest',
                error: 'Error logging in.',
              }),
            )
          }
        }),
      )
      return
    }
    if (
      req.headers['session-token'] !==
      '1234567890abcdef1234567890abcdef-1234567890abcdef1234567890abcdef'
    ) {
      res.statusCode = 401
      res.end(JSON.stringify({ status: 401, code: 'Unauthorized' }))
      return
    }
    if (
      method === 'GET' &&
      /^\/users\/(me|1234567890abcdef123456789011111)/.test(url)
    ) {
      res.statusCode = 200
      res.end(JSON.stringify({ user: ownerUserResponse }))
    } else if (
      method === 'GET' &&
      /^\/users\/(1234567890abcdef123456789022222)/.test(url)
    ) {
      res.statusCode = 200
      res.end(JSON.stringify({ user: partnerUserResponse }))
    } else if (method === 'GET' && /^\/devices\/.*/.test(url)) {
      res.statusCode = 200
      res.end(JSON.stringify({ device: deviceResponse }))
    } else {
      res.statusCode = 404
      res.end()
    }
  }

  protected async _start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = (this.server = createServer(this._handleRequest))
      server.once('error', reject)
      server.listen(PORT, () => {
        server.off('error', reject)
        resolve()
      })
    })
  }

  protected async _stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()))
      delete this.server
    })
  }
}
