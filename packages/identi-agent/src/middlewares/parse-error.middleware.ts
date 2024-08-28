import httpStatus from 'http-status'
import HttpError from '../core/errors/http.error.js'
import ValidateFieldsError from '../core/errors/validate-fields.error.js'
import ERROR_TYPES from '../core/constants/error-types.js'
import { Response, Request, NextFunction } from 'express'
import logger from '../services/logger.js'

/**
 * Try to convert all errors in the pipe to a common
 * interface aiming for better manipulation
 * If error is not an instanceOf HttpError, convert it.
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const parseErrorMiddleware = async (err: any, _: Request, res: Response, __: NextFunction) => {
  const currentError = Object.assign({}, err)
  logger.error(err)
  if (err instanceof HttpError || err instanceof ValidateFieldsError) {
    return res.status(currentError.status_code).json(currentError)
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    status_code: httpStatus.INTERNAL_SERVER_ERROR,
    code: 0,
    type: ERROR_TYPES.INTERNAL_SERVER_ERROR,
  })
}

export default parseErrorMiddleware
