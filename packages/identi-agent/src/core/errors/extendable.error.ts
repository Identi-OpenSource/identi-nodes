/**
 * @extends Error
 * @class ExtendableError
 * @classdesc Class representing an ExtendableError error.
 * @property {string} type - Error type.
 * @property {number} status_code - HTTP status_code code of error.
 * @property {number} code - code.
 * @property {string} message - Error message.
 */
class ExtendableError extends Error {
  message: string
  type: string
  status_code: number
  code: number

  /**
   * Creates an ExtendableError error.
   * @param type - Error type.
   * @param message - Error message.
   * @param status_code - HTTP status_code code of error.
   * @param code - code.
   * @param error_type - Error Type.
   */
  constructor(message: string, type: string, status_code: number, code: number) {
    super(message)
    this.name = this.constructor.name
    this.type = type
    this.message = Array.isArray(message) ? message : message?.toString()
    this.status_code = status_code
    this.code = code
    // @ts-ignore
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ExtendableError
