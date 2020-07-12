import BaseError from 'baseerr'

export class NetworkError extends BaseError<{}> {}
export class StatusCodeError extends BaseError<{
  status: number
  body?: string
}> {}
export class InvalidResponseError extends BaseError<{}> {}
