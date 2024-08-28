import { Request, Response } from 'express'
import { getCryptoAgent } from '../../../services/crypto-agent.js'
import ObfuscateIdentifierResource from '../../../services/obfuscate-identifier.js'
import config from '../../../core/config/index.js'
import { IIdentiKeyManager } from '../../../interfaces/IIdentiKeyManager.js'
import { ManagedKeyInfo, TAgent } from '@veramo/core'
import { MasterWalletRepository, TransactionRepository } from '../../../repositories/index.js'
import { CryptoWalletRequest, TransferTokensRequest } from '../dto/requests.js'

class CryptoWalletController {
  /**
   * Create a Crypto Wallet for a DID
   *
   * @param {Request} req
   * @param {CryptoWalletRequest} req.body
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   */
  static async create(req: Request, res: Response) {
    try {
      const { identifier }: CryptoWalletRequest = req.body

      const obfuscateIdentifierResource = new ObfuscateIdentifierResource({
        privateKey: config.CELO_PRIVATE_KEY,
        nodeUrl: config.CELO_NODE_URL,
      })
      const lookupIdentifier = await obfuscateIdentifierResource.lookupAttestations(identifier)
      if (lookupIdentifier === undefined) {
        return res.status(500).json({ error: 'Identificador no posee un DID registrado' })
      }
      const wallet = await MasterWalletRepository.findOne({ where: { id_wallet: lookupIdentifier } })
      if (wallet.crypto_wallet_kid) {
        return res.status(409).json({ error: 'DID ya posee un Wallet registrado' })
      }

      const cryptoAgente: TAgent<IIdentiKeyManager> = await getCryptoAgent()

      const cryptoWallet: ManagedKeyInfo = await cryptoAgente.keyManagerCreate({
        type: 'Secp256k1',
        kms: 'local',
        meta: {
          algorithms: ['Secp256k1'],
        },
      })

      MasterWalletRepository.update({ crypto_wallet_kid: cryptoWallet.kid }, { where: { id_wallet: lookupIdentifier } })

      // TODO: Call Faucet to get some cUSD
      return res.status(201).json({ message: 'Ok' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Problemas al crear Crypto Wallet' })
    }
  }

  /**
   * Transfer tokens between DIDs
   *
   * This endpoint uses the verifyVCToken middleware that has the DID of the sender.
   *
   * @param {Request} req
   * @param {TransferTokensRequest} req.body
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   */
  static async transferTokens(req: Request, res: Response) {
    try {
      const { identifierTo, amount }: TransferTokensRequest = req.body

      const cryptoAgente: TAgent<IIdentiKeyManager> = await getCryptoAgent()

      const obfuscateIdentifierResource = new ObfuscateIdentifierResource({
        privateKey: config.CELO_PRIVATE_KEY,
        nodeUrl: config.CELO_NODE_URL,
      })

      if (!req.crypto_wallet_kid) {
        return res.status(500).json({ error: 'Identificador emisor no posee una Wallet registrada' })
      }
      const fromWallet = await MasterWalletRepository.findOne({
        where: { crypto_wallet_kid: req.crypto_wallet_kid },
      })

      const toAccount = await obfuscateIdentifierResource.lookupAttestations(identifierTo)

      const toWallet = await MasterWalletRepository.findOne({ where: { id_wallet: toAccount } })
      if (!toWallet) {
        return res.status(500).json({ error: 'Identificador destinatario no posee un DID registrado' })
      }
      if (!toWallet.crypto_wallet_kid) {
        return res.status(500).json({ error: 'Identificador destinatario no posee una Wallet registrada' })
      }

      // convert amount in soles to dollars
      const DOLLAR_TO_SOL = 3.5
      const amountInDollars = (Number(amount) / DOLLAR_TO_SOL).toFixed(6)

      const transaction = await cryptoAgente.transferTokens({
        nodeUrl: config.CELO_NODE_URL,
        kms: config.VERAMO_KMS,
        kidFrom: fromWallet.crypto_wallet_kid,
        kidTo: toWallet.crypto_wallet_kid,
        amount: amountInDollars.toString(),
        contractAddress: config.USDC_CONTRACT_ADDRESS,
        contractAddressFee: config.USDC_ADAPTER_CONTRACT_ADDRESS,
      })

      await TransactionRepository.create({
        from_wallet_id: fromWallet.id_wallet,
        to_wallet_id: toWallet.id_wallet,
        amount: amount,
        transaction_date: new Date(),
        status: 'SUCCESS',
        transaction_hash: transaction.transactionHash,
      })

      return res.status(200).json({ message: 'Tokens transferidos' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Problemas al transferir tokens' })
    }
  }

  /**
   * Get the balance of the DID's wallet
   *
   * This endpoint uses the verifyVCToken middleware that has the DID of the sender.
   *
   * @param {Request} req
   * @param {Response} res
   *
   * @returns {Promise<balance>}
   */
  static async getBalance(req: Request, res: Response) {
    try {
      const cryptoAgente: TAgent<IIdentiKeyManager> = await getCryptoAgent()

      if (!req.crypto_wallet_kid) {
        return res.status(500).json({ error: 'El Identificador no posee una Wallet registrada' })
      }

      let balance: any = await cryptoAgente.balance({
        nodeUrl: config.CELO_NODE_URL,
        kms: config.VERAMO_KMS,
        kid: req.crypto_wallet_kid,
        contractAddress: config.USDC_CONTRACT_ADDRESS,
      })

      // TODO: Refactor by the endpoint that gets the current dollar value.
      const DOLLAR_TO_SOL = 3.7

      if (balance !== '0') {
        balance = (Number(balance) * DOLLAR_TO_SOL).toFixed(2)
      }

      return res.status(200).json({ balance })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Problemas al obtener el balance' })
    }
  }
}

export default CryptoWalletController
