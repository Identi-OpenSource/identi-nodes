import { Router } from 'express'

import verifyWalletRouter from '../modules/verifyWallet/routes/index.js'
import didWalletRouter from '../modules/didWallet/routes/index.js'
import cryptoWalletRouter from '../modules/cryptoWallet/routes/index.js'
import authRouter from '../modules/authVC/routes/index.js'

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     APIKeyHeader:
 *       description: API Key Authentication
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *     VerifiableCredentialTokenHeader:
 *       description: Verifiable Credential Token Authentication
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *   schemas:
 *     ErrorResponse:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        message:
 *          type: string
 *        status:
 *          type: string
 *        code:
 *          type: string
 *        error_type:
 *          type: string
 *   responses:
 *     GeneralError:
 *       description: General error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
const router = Router()

router.use('/verify_wallets', verifyWalletRouter)
router.use('/did', didWalletRouter)
router.use('/crypto', cryptoWalletRouter)
router.use('/auth', authRouter)

export { router }
