import ExtendableError from './extendable.error.js'
import httpStatus from 'http-status'

/**
 * Class representing an ValidateFieldsError error.
 * @extends ExtendableError
 */
class ValidateFieldsError extends ExtendableError {
  errors: any
  /**
   * Creates an ValidateFieldsError error.
   * @param {string} message - Error message.
   * @param {number} status_code - HTTP status_code code of error.
   * @param {number} code - code.
   * @param {json} errors - Errors.
   */
  constructor(
    message: string,
    type: string,
    errors: any,
    status_code: number = httpStatus.UNPROCESSABLE_ENTITY,
    code: number = 0
  ) {
    super(message, type, status_code, code || 0)
    this.errors = errors
  }
}

export default ValidateFieldsError
