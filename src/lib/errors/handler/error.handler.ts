export class HandlerError {
  createError ({ name = 'Error', code, cause, message }: { name?: string, code?: number, cause?: any, message: string }): void {
    const error = new CustomError()
    error.name = name
    error.code = code
    error.cause = cause
    error.message = message
    throw error
  }
}

export class CustomError extends Error {
  code?: number
  cause?: any

  constructor () {
    super()
    this.name = 'CustomError'
    this.code = 500
    this.cause = undefined
    this.message = 'Unknown error'
  }
}
