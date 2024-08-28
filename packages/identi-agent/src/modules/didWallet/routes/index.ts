import { Router } from 'express'

import DIDWalletController from '../controllers/index.js'
import IssueController from '../controllers/issue.controller.js'
import verifyJWTToken from '../../../middlewares/verifyJWTToken.js'
import middlewareJWT, { decodeJWT } from '../../../middlewares/middlewareJWT.js'
import verifyVCToken from '../../../middlewares/verifyVCToken.js'
import { validationMiddleware } from '../../../middlewares/index.js'
import {
  CreateDIDRequest,
  IssueVerifiableCredentialRequest,
  ShareVerifiableCredentialRequest,
} from '../dto/requests.js'

const router = Router()

/**
 * @swagger
 * /did:
 *   post:
 *     tags:
 *       - DID
 *     security:
 *       - APIKeyHeader: []
 *     summary: Create a new DID
 *     description: This endpoint creates a new DID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifiers:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - identifiers
 *     responses:
 *       200:
 *         description: Created DID successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     did:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Identifier already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/GeneralError'
 */
router.post('', verifyJWTToken(), validationMiddleware(CreateDIDRequest), DIDWalletController.create)

/**
 * @swagger
 * /did/view:
 *   post:
 *     tags:
 *       - DID
 *     security:
 *       - VerifiableCredentialTokenHeader: []
 *     summary: Get DID
 *     description: This endpoint returns the DID.
 *     responses:
 *       200:
 *         description: DID retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         $ref: '#/components/responses/GeneralError'
 */
router.post('/view', verifyVCToken, DIDWalletController.getDID)

/**
 * @swagger
 * /did/verifiable_credentials/list_names:
 *   get:
 *     tags:
 *       - DID
 *     security:
 *       - VerifiableCredentialTokenHeader: []
 *     summary: List verifiable credentials
 *     description: Issue a Verifiable Credential
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
 *                 verifiable_credentials:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      name:
 *                        type: string
 *       404:
 *         description: No verifiable credentials found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/GeneralError'
 */
router.get('/verifiable_credentials/list_names', verifyVCToken, DIDWalletController.listNamesVerifiableCredentials)

/**
 * @swagger
 * /did/verifiable_credentials/issue:
 *   post:
 *     tags:
 *       - DID
 *     security:
 *       - APIKeyHeader: []
 *     summary: Issue a Verifiable Credential
 *     description: Issue a Verifiable Credential
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *             identifier:
 *               type: string
 *             credential_subject:
 *               type: object
 *             credential_type:
 *               type: string
 *             valid_period:
 *               type: string
 *               example: 1y|1m|1d
 *             is_return_hash:
 *               type: boolean
 *               example: false
 *     responses:
 *       200:
 *         description: Verifiable Credential issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 hash:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                    id:
 *                      type: string
 *                    '@context':
 *                      type: array
 *                      items:
 *                        type: string
 *                    credentialSubject:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                    issuer:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                    type:
 *                      type: array
 *                      items:
 *                        type: string
 *                    issuanceDate:
 *                      type: string
 *                      format: date-time
 *                      example: '2023-10-05T14:48:00.000Z'
 *                    expirationDate:
 *                      type: string
 *                      format: date-time
 *                      example: '2023-10-05T14:48:00.000Z'
 *                    proof:
 *                      type: object
 *                      properties:
 *                        type:
 *                          type: string
 *                          example: JwtProof2020
 *                        jwt:
 *                          type: string
 *       400:
 *         description: Identifier not found or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/GeneralError'
 */
router.post(
  '/verifiable_credentials/issue',
  verifyJWTToken(),
  validationMiddleware(IssueVerifiableCredentialRequest),
  DIDWalletController.issueVerifiableCredential
)

/**
 * @swagger
 * /did/verifiable_credentials/share:
 *   post:
 *     tags:
 *       - DID
 *     security:
 *       - VerifiableCredentialTokenHeader: []
 *     summary: Share a verifiable credential
 *     produces:
 *       - application/json
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *             verifiable_credential_id:
 *               type: string
 *     responses:
 *       201:
 *         description: Verifiable credentials shared successfully
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                url:
 *                  type: string
 *       404:
 *         description: No verifiable credentials found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/GeneralError'
 */
router.post(
  '/verifiable_credentials/share',
  verifyVCToken,
  validationMiddleware(ShareVerifiableCredentialRequest),
  DIDWalletController.shareVerifiableCredential
)

/**
 * @swagger
 * /did/verifiable_credentials/list_shared:
 *   get:
 *     tags:
 *       - DID
 *     security:
 *       - VerifiableCredentialTokenHeader: []
 *     summary: List shared verifiable credentials
 *     responses:
 *       200:
 *         description: Verifiable Credential issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      '@context':
 *                        type: array
 *                        items:
 *                          type: string
 *                      credentialSubject:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                      issuer:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                      type:
 *                        type: array
 *                        items:
 *                          type: string
 *                      issuanceDate:
 *                        type: string
 *                        format: date-time
 *                        example: '2023-10-05T14:48:00.000Z'
 *                      expirationDate:
 *                        type: string
 *                        format: date-time
 *                        example: '2023-10-05T14:48:00.000Z'
 *                      proof:
 *                        type: object
 *                        properties:
 *                          type:
 *                            type: string
 *                            example: JwtProof2020
 *                          jwt:
 *                            type: string
 *       500:
 *         description: Problems creating the Crypto or identifier does not have a registered Crypto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get(
  '/verifiable_credentials/list_shared',
  middlewareJWT,
  decodeJWT,
  DIDWalletController.listSharedVerifiableCredential
)

/**
 * @swagger
 * /did/verifiable_credentials/verify:
 *   post:
 *     tags:
 *       - DID
 *     security:
 *       - APIKeyHeader: []
 *     description: Verifies a credential
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *             credential:
 *               type: object
 *     responses:
 *       200:
 *         description: Returns a success message and the verification status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 verified:
 *                   type: boolean
 *       500:
 *         $ref: '#/components/responses/GeneralError'
 */
router.post('/verifiable_credentials/verify', middlewareJWT, DIDWalletController.verifyCredential)

export default router
