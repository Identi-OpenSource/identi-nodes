import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../core/config/index.js'
import getToken from '../utils/get_token.js'
import HttpError from '../core/errors/http.error.js'

export default function middlewareJWT(req: Request, _: Response, next: NextFunction) {
  const token = req.headers['authorization'] as string
  if (!token) {
    throw new HttpError('Token not provided', 'NoAuthorizationToken', 401, 0)
  }

  try {
    const tokenValue = getToken(token)

    const decoded: any = jwt.verify(tokenValue, config.SHARE_VC_HASH_KEY)
    if (decoded?.service !== 'ms-identi-agent') {
      throw new HttpError('No cuentas con permisos suficientes.', 'NoAuthorizationToken', 401, 0)
    }
    next()
  } catch (err) {
    throw new HttpError('Token not valid', 'NoAuthorizationToken', 401, 0)
  }
}

export function decodeJWT(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'] as string
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  try {
    const tokenValue = getToken(token)

    const decoded: any = jwt.decode(tokenValue)

    // @ts-ignore
    req.verifiable_credentials_id = decoded?.verifiable_credentials_id
    next()
  } catch (err) {
    throw new HttpError('Token not valid', 'NoAuthorizationToken', 401, 0)
  }
}
