import ExtendableError from './extendable.error.js'
/**
 * Class representing an HttpError error.
 * @extends ExtendableError
 */
class HttpError extends ExtendableError {
  /**
   * Creates an HttpError error.
   * @param {string} message - Error message.
   * @param {string} type - Error message.
   * @param {number} status_code - HTTP status_code code of error.
   * @param {number} code - code.
   */
  constructor(message: string, type: string, status_code: number = 500, code: number = 0) {
    super(message, type, status_code, code || 0)
  }
}

export default HttpError
