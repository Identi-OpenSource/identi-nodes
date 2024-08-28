import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import HttpError from '../core/errors/http.error.js'
import jwt from 'jsonwebtoken'
import getToken from '../utils/get_token.js'
import config from '../core/config/index.js'
import getDIDAgent from '../services/did-agent.js'

export default async function verifyVCToken(req: Request, _: Response, next: NextFunction) {
  try {
    const token = req.headers['authorization'] as string
    if (!token) {
      throw new HttpError('Token not provided', 'NoAuthorizationToken', httpStatus.UNAUTHORIZED, 0)
    }

    const accessToken = getToken(token)
    const decoded: any = jwt.verify(accessToken, config.JWT_HASH_KEY)
    if (decoded?.service !== 'ms-identi-agent') {
      throw new HttpError('No cuentas con permisos suficientes.', 'NoAuthorizationToken', httpStatus.UNAUTHORIZED, 0)
    }

    const DIDAgent = await getDIDAgent()

    const verifyVC = await DIDAgent.verifyCredential({
      credential: decoded.credential,
      policies: {
        now: Math.floor(Date.now() / 1000),
        expirationDate: true,
      },
    })

    if (!verifyVC.verified) {
      throw new HttpError('Token expired', 'NoAuthorizationToken', httpStatus.UNAUTHORIZED, 0)
    }

    req.did = decoded?.credential?.credentialSubject?.id
    req.crypto_wallet_kid = decoded?.credential?.credentialSubject?.wallet_kid

    next()
  } catch (err) {
    if (err instanceof HttpError) {
      next(err)
      return
    }
    next(new HttpError('Token not valid', 'No AuthorizationToken', httpStatus.UNAUTHORIZED, 0))
  }
}
