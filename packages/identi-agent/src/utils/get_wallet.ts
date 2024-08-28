import { Request, Response, NextFunction } from 'express'
import config from '../core/config/index.js'
import ObfuscateIdentifierResource from '../services/obfuscate-identifier.js'
import { MasterWalletRepository } from '../repositories/index.js'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.body

  const obfuscateIdentifierResource = new ObfuscateIdentifierResource({
    privateKey: config.CELO_PRIVATE_KEY,
    nodeUrl: config.CELO_NODE_URL,
  })
  const lookupIdentifier = await obfuscateIdentifierResource.lookupAttestations(identifier)
  if (lookupIdentifier === undefined) {
    return res.status(500).json({ error: 'Identificador no posee un DID registrado' })
  }
  const wallet = await MasterWalletRepository.findOne({ where: { id_wallet: lookupIdentifier } })
  if (!wallet.crypto_wallet_kid) {
    return res.status(409).json({ error: 'DID no posee una Wallet registrada' })
  }

  req.crypto_wallet_kid = wallet.crypto_wallet_kid
  next()
}
