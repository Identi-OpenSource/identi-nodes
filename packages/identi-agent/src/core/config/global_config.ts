import _ from 'express'

declare global {
  namespace Express {
    interface Request {
      did?: string
      crypto_wallet_kid?: string
      jwtPayload?: any
    }
  }
}
