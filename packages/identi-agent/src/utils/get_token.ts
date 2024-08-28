import httpStatus from 'http-status'
import config from '../core/config/index.js'
import HttpError from '../core/errors/http.error.js'

export default function getToken(token: string) {
  const access_token_key = token.split(' ')[0]
  const access_token_jwt = token.split(' ')[1]
  if (access_token_key !== config.AWS_JWT_PREFIX) {
    throw new HttpError('Prefix invalid', 'InvalidJWTPrefix', httpStatus.UNAUTHORIZED, 0)
  }
  return access_token_jwt
}
