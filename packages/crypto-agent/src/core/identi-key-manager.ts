import { AbstractKeyStore, KeyManager } from '@veramo/key-manager'
import { IdentiAbstractKeyManagementSystem } from '../interfaces/identi-abstract-key-management-system.js'

import { computeAddress } from 'ethers'

class IdentiKeyManager extends KeyManager {
  private identiStore: AbstractKeyStore
  private identiKms: Record<string, IdentiAbstractKeyManagementSystem>

  constructor(options: { store: AbstractKeyStore; kms: Record<string, IdentiAbstractKeyManagementSystem> }) {
    super({
      store: options.store,
      kms: options.kms,
    })
    this.identiStore = options.store
    this.identiKms = options.kms
    // @ts-ignore
    this.methods = {
      ...this.methods,
      transferTokens: this.transferTokens.bind(this),
      balance: this.balance.bind(this),
    }
  }

  private getIdentiKms(name: string): IdentiAbstractKeyManagementSystem {
    const kms = this.identiKms[name]
    if (!kms) {
      throw Error(`invalid_argument: This agent has no registered KeyManagementSystem with name='${name}'`)
    }
    return kms
  }

  /** {@inheritDoc @veramo/core-types#IKeyManager.keyManagerCreate} */
  // @ts-ignore
  async transferTokens({ nodeUrl, kidFrom, kidTo, amount, kms, contractAddress, contractAddressFee }) {
    const currentKms = this.getIdentiKms(kms)

    const KidToKey = await this.identiStore.getKey({ kid: kidTo })
    const addressTo = computeAddress('0x' + KidToKey.publicKeyHex)

    const result = await currentKms.transferTokens({
      nodeUrl,
      kidFrom,
      addressTo,
      amount,
      contractAddress,
      contractAddressFee,
    })

    return {
      message: 'Tokens sent successfully',
      transactionHash: result.transactionHash,
    }
  }

  // create a function for consult the balance of the wallet
  // @ts-ignore
  async balance({ nodeUrl, kid, kms, contractAddress }) {
    const currentKms = this.getIdentiKms(kms)
    return currentKms.balance({ nodeUrl, kid, contractAddress })
  }
}
export default IdentiKeyManager
