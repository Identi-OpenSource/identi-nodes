import { newKit } from '@celo/contractkit'
import { AbstractPrivateKeyStore } from '@veramo/key-manager'
import { KeyManagementSystem } from '@veramo/kms-local'

class IdentiKeyManagementSystem extends KeyManagementSystem {
  private readonly identiKeyStore: AbstractPrivateKeyStore
  constructor(keyStore: AbstractPrivateKeyStore) {
    super(keyStore)
    this.identiKeyStore = keyStore
  }

  // @ts-ignore
  async transferTokens({ nodeUrl, kidFrom, addressTo, amount, contractAddress, contractAddressFee }) {
    const kidFromKey = await this.identiKeyStore.getKey({ alias: kidFrom })

    let issuerKit = newKit(nodeUrl)
    const issuer = issuerKit.web3.eth.accounts.privateKeyToAccount(kidFromKey.privateKeyHex)
    issuerKit.addAccount(kidFromKey.privateKeyHex)
    // @ts-ignore
    issuerKit.defaultAccount = issuer.address

    const convertedAmount = (Number(amount) * 1e6).toFixed(0)

    const stableToken = await issuerKit.contracts.getErc20(contractAddress)
    await issuerKit.setFeeCurrency(contractAddressFee)

    const transaction = await stableToken.transfer(addressTo, convertedAmount).sendAndWaitForReceipt({
      gasPrice: 20000000000,
    })

    return {
      message: 'Tokens sent successfully',
      transactionHash: transaction.transactionHash,
    }
  }

  // @ts-ignore
  async balance({ nodeUrl, kid, contractAddress }) {
    const kidKey = await this.identiKeyStore.getKey({ alias: kid })

    let issuerKit = newKit(nodeUrl)
    const issuer = issuerKit.web3.eth.accounts.privateKeyToAccount(kidKey.privateKeyHex)
    issuerKit.addAccount(kidKey.privateKeyHex)
    // @ts-ignore
    issuerKit.defaultAccount = issuer.address

    const stableToken = await issuerKit.contracts.getErc20(contractAddress)

    const balance = await stableToken.balanceOf(issuer.address)

    return (Number(balance.toString()) / 1e6).toString()
  }
}

export default IdentiKeyManagementSystem
