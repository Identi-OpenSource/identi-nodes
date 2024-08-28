import { Request, Response } from 'express'
import getDIDAgent from '../../../services/did-agent.js'
import ObfuscateIdentifierResource from '../../../services/obfuscate-identifier.js'
import { ProofFormat } from '@veramo/core'
import config from '../../../core/config/index.js'
import { v4 as uuidv4 } from 'uuid'
import { MasterWalletRepository } from '../../../repositories/index.js'
import jwt from 'jsonwebtoken'
import { AuthVCRequest } from '../dto/requests.js'

export default class AuthVCController {
  /**
   * Issues an authentication verifiable credential to be used as an access token
   *
   * @param {AuthVCRequest} req.body
   *
   * @returns {Promise<Response>}
   */
  static async auth(req: Request, res: Response) {
    try {
      const { identifier, biometric_metadata }: AuthVCRequest = req.body

      const obfuscateIdentifierResource = new ObfuscateIdentifierResource({
        privateKey: config.CELO_PRIVATE_KEY,
        nodeUrl: config.CELO_NODE_URL,
      })

      const lookupIdentifier = await obfuscateIdentifierResource.lookupAttestations(identifier)
      if (lookupIdentifier === undefined) {
        return res.status(404).json({ error: 'Identificador no posee un DID registrado' })
      }

      const wallet = await MasterWalletRepository.findOne({ where: { id_wallet: lookupIdentifier } })
      if (!wallet) {
        return res.status(404).json({ error: 'Identificador no posee una DID' })
      }

      const DIDAgent = await getDIDAgent()

      const issuanceDate = new Date().toISOString()

      const expirationDate = new Date(issuanceDate)
      expirationDate.setMinutes(expirationDate.getMinutes() + 10)

      const credential = {
        credential: {
          id: uuidv4(),
          issuer: { id: config.IDENTI_DID },
          issuanceDate: issuanceDate,
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'AuthVerifiableCredential'],
          credentialSubject: {
            id: wallet.did,
            wallet_kid: wallet.crypto_wallet_kid,
            biometric_metadata,
          },
          expirationDate: expirationDate.toISOString(),
        },
        proofFormat: 'jwt' as ProofFormat,
        save: false,
      }

      const issueVC = await DIDAgent.createVerifiableCredential(credential)

      const newToken = jwt.sign({ service: 'ms-identi-agent', credential: issueVC }, config.JWT_HASH_KEY, {
        expiresIn: '10m',
      })

      return res.status(200).json({ token: `Identi ${newToken}` })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Problemas al autenticar la DID' })
    }
  }
}
