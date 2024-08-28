import { Router } from 'express'

import verifyWalletRouter from '../controllers/index.js'
import verifyJWTToken from '../../../middlewares/verifyJWTToken.js'
import { VerifyWalletRequest } from '../dto/requests.js'
import validationMiddleware from '../../../middlewares/validation.middleware.js'

const router = Router()

/**
 * @swagger
 * /verify_wallets:
 *   post:
 *     tags:
 *       - Verify
 *     security:
 *       - APIKeyHeader: []
 *     summary: Check whether DID and Crypto Wallets have been created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *               validation_type:
 *                 type: string
 *                 enum: ['VALIDATE_DID_AND_CRYPTO_WALLETS', 'VALIDATE_ONLY_DID_WALLET']
 *     responses:
 *       200:
 *         description: Wallets created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: "Validations: Identifier doesn't have a DID | Identifier doesn't have a Crypto Wallet"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error to transfer tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('', verifyJWTToken(), validationMiddleware(VerifyWalletRequest), verifyWalletRouter.verify_wallet)

export default router
