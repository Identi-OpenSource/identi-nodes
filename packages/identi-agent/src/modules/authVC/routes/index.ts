import { Router } from 'express'

import Controller from '../controllers/index.js'
import verifyJWTToken from '../../../middlewares/verifyJWTToken.js'
import validationMiddleware from '../../../middlewares/validation.middleware.js'
import { AuthVCRequest } from '../dto/requests.js'

const router = Router()

/**
 * @swagger
 * /auth:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       - APIKeyHeader: []
 *     summary: Generate access token using a verifiable credential
 *     description: Issues an authentication verifiable credential to be used as an access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *               biometric_metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Token successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: Validate DID and Crypto Wallet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/GeneralError'
 */
router.post('', verifyJWTToken(), validationMiddleware(AuthVCRequest), Controller.auth)

export default router
