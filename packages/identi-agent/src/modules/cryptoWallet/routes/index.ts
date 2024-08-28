import { Router } from 'express'

import CryptoWalletController from '../controllers/index.js'
import verifyVCToken from '../../../middlewares/verifyVCToken.js'
import verifyJWTToken from '../../../middlewares/verifyJWTToken.js'
import validationMiddleware from '../../../middlewares/validation.middleware.js'
import { CryptoWalletRequest } from '../dto/requests.js'

const router = Router()

/**
 * @swagger
 * /crypto:
 *   post:
 *     tags:
 *       - Crypto
 *     security:
 *       - APIKeyHeader: []
 *     summary: Create a new Crypto Wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crypto Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Problems creating the Crypto or Identifier does not have a registered Crypto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('', verifyJWTToken(), validationMiddleware(CryptoWalletRequest), CryptoWalletController.create)

/**
 * @swagger
 * /crypto/transfer_tokens:
 *   post:
 *     tags:
 *       - Crypto
 *     security:
 *       - VerifiableCredentialTokenHeader: []
 *     summary: Transfer tokens between DIDs
 *     description: This endpoint transfers tokens from one DID to another.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifierTo:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tokens transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Problems transferring tokens or identifier does not have a registered DID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/transfer_tokens', verifyVCToken, CryptoWalletController.transferTokens)

/**
 * @swagger
 * /crypto/balance:
 *   post:
 *     tags:
 *       - Crypto
 *     security:
 *       - VerifiableCredentialTokenHeader: []
 *     summary: Retrieve the balance of an account
 *     description: Retrieves the balance of an account. The identifier is provided in the request body. The balance is returned in SOL, converted from dollars at a rate of 3.8.
 *     responses:
 *       200:
 *         description: The balance of the identifier account, in SOL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: string
 *                   description: The balance of the account, in SOL.
 *       500:
 *         description: There was an error retrieving the balance, or the identifier does not have a registered DID or Wallet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 */
router.post('/balance', verifyVCToken, CryptoWalletController.getBalance)

export default router
