// create a function to generate jwt with a payload pass as parameter and return the jwt with time expiration 10 minutes

import config from '../core/config/index.js'
import jwt from 'jsonwebtoken'

export default function generateJWT(payload: any) {
  return jwt.sign(payload, config.SHARE_VC_HASH_KEY, { expiresIn: '10m' })
}
