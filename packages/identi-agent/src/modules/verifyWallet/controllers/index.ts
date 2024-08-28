import { Request, Response } from 'express'
import ObfuscateIdentifierResource from '../../../services/obfuscate-identifier.js'
import config from '../../../core/config/index.js'
import { MasterWalletRepository } from '../../../repositories/index.js'
import { VerifyWalletRequest } from '../dto/requests.js'

class VerifyWalletController {
  /**
   * Check whether DID and Crypto Wallets have been created
   *
   * @param {Request} req
   * @param {VerifyWalletRequest} req.body
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   */
  static async verify_wallet(req: Request, res: Response) {
    try {
      const { identifier, validation_type }: VerifyWalletRequest = req.body // VALIDATE_ONLY_DID_WALLET | VALIDATE_DID_AND_CRYPTO_WALLETS

      const validate_wallets = validation_type || 'VALIDATE_DID_AND_CRYPTO_WALLETS'

      const obfuscateIdentifierResource = new ObfuscateIdentifierResource({
        privateKey: config.CELO_PRIVATE_KEY,
        nodeUrl: config.CELO_NODE_URL,
      })

      const identifierAccount = await obfuscateIdentifierResource.lookupAttestations(identifier)
      if (!identifierAccount) {
        return res.status(404).json({ message: 'Identificador no posee una DID registrada' })
      }

      const identifierWallet = await MasterWalletRepository.findOne({ where: { id_wallet: identifierAccount } })
      if (!identifierWallet) {
        return res.status(404).json({ message: 'Identificador no posee una DID registrada' })
      }

      if (!identifierWallet.crypto_wallet_kid) {
        if (validate_wallets === 'VALIDATE_DID_AND_CRYPTO_WALLETS') {
          return res.status(500).json({ message: 'El identificador no posee una crypto wallet registrada' })
        }
      }

      return res.status(200).json({ message: 'Wallets created' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Problemas al verificar.' })
    }
  }
}

export default VerifyWalletController
