import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import config from '../core/config/index.js'
import HttpError from '../core/errors/http.error.js'
import getToken from '../utils/get_token.js'

export default function verifyJWTToken(
  hash_key?: string
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers['authorization'] as string
      if (!token) {
        throw new HttpError('Token not provided', 'NoAuthorizationToken', httpStatus.UNAUTHORIZED, 0)
      }

      const tokenValue = getToken(token)

      const payload = jwt.verify(tokenValue, hash_key ? hash_key : config.JWT_HASH_KEY)

      req.jwtPayload = payload
      next()
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        next(new HttpError('Token has expired', 'TokenExpired', httpStatus.UNAUTHORIZED, 0))
        return
      }
      next(
        err instanceof HttpError
          ? err
          : new HttpError('Token not valid', 'NoAuthorizationToken', httpStatus.UNAUTHORIZED, 0)
      )
    }
  }
}
