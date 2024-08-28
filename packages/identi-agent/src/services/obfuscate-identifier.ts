import { Address, ContractKit, newKit } from '@celo/contractkit'
import { OdisUtils } from '@celo/identity'
import { Account } from 'web3-core'
import { AuthSigner, getServiceContext, OdisContextName } from '@celo/identity/lib/odis/query.js'
import { IdentifierPrefix } from '@celo/identity/lib/odis/identifier.js'
import { FederatedAttestationsWrapper } from '@celo/contractkit/lib/wrappers/FederatedAttestations'

/**
 * Class to obfuscate an identifier and register an attestation using ODIS Contract
 */
export default class ObfuscateIdentifierResource {
  private issuerKit: ContractKit
  private issuer: Account

  constructor({ privateKey, nodeUrl }: { privateKey: string; nodeUrl: string }) {
    this.issuerKit = newKit(nodeUrl)
    this.issuerKit.addAccount(privateKey)
    this.issuer = this.issuerKit.web3.eth.accounts.privateKeyToAccount(privateKey)
    // @ts-ignore
    this.issuerKit.defaultAccount = this.issuer.address
  }

  /**
   * Pay the ODIS service with 0.02 cUSD
   */
  private async payQuota() {
    const ONE_CENT_CUSD_WEI = this.issuerKit.web3.utils.toWei('0.02', 'ether')
    // give odis payment contract permission to use cUSD
    const stableTokenContract = await this.issuerKit.contracts.getStableToken()
    const odisPaymentsContract = await this.issuerKit.contracts.getOdisPayments()

    await stableTokenContract.increaseAllowance(odisPaymentsContract.address, ONE_CENT_CUSD_WEI).sendAndWaitForReceipt()

    await odisPaymentsContract.payInCUSD(this.issuer.address, ONE_CENT_CUSD_WEI).sendAndWaitForReceipt()
  }

  /**
   * Get the obfuscated identifier using the ODIS service
   *
   * @param identifier Identifier to be obfuscated
   * @returns Obfuscated identifier
   */
  public async getObfuscatedIdentifier(identifier: string): Promise<string> {
    const authSigner: AuthSigner = {
      authenticationMethod: OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
      // @ts-ignore
      contractKit: this.issuerKit,
    }

    const serviceContext = getServiceContext(OdisContextName.ALFAJORES)
    //check remaining quota
    const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(this.issuer.address, authSigner, serviceContext)
    console.info('remainingQuota', remainingQuota)
    if (remainingQuota < 1) {
      await this.payQuota()
      const { remainingQuota: newRemainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
        this.issuer.address,
        authSigner,
        serviceContext
      )
      console.info('other-remainingQuota', newRemainingQuota)
    }

    const response = await OdisUtils.Identifier.getObfuscatedIdentifier(
      identifier,
      IdentifierPrefix.NULL,
      this.issuer.address,
      authSigner,
      serviceContext
    )
    return response.obfuscatedIdentifier
  }

  /**
   * Register an attestation using the federated attestations contract
   *
   * @param address Address to be attested
   * @param identifier Identifier to be obfuscated
   * @param obfuscatedIdentifier Already obfuscated identifier
   * @returns True if the attestation was registered, False if the attestation already exists
   */
  public async registerAttestation(
    address: string,
    identifier?: string,
    obfuscatedIdentifier?: string
  ): Promise<boolean> {
    const federatedAttestationsContract = await this.issuerKit.contracts.getFederatedAttestations()

    const currentObfuscatedIdentifier = obfuscatedIdentifier || (await this.getObfuscatedIdentifier(identifier!))

    const { accounts } = await federatedAttestationsContract.lookupAttestations(currentObfuscatedIdentifier, [
      this.issuer.address,
    ])

    if (accounts.length === 0) {
      const verificationTime = Math.floor(new Date().getTime() / 1000)
      await federatedAttestationsContract
        .registerAttestationAsIssuer(currentObfuscatedIdentifier, address, verificationTime)
        .sendAndWaitForReceipt()
      return true
    }

    console.info('Attestation already exists')
    return false
  }

  /**
   * Get from the federated attestations contract the account that has been attested by the issuer
   *
   * @param identifier
   * @param obfuscatedIdentifier
   *
   * @returns The account address that has been attested by the issuer
   * @returns Undefined if the account has not been attested by the issuer
   */
  public async lookupAttestations(identifier?: string, obfuscatedIdentifier?: string): Promise<Address | undefined> {
    try {
      const federatedAttestationsContract: FederatedAttestationsWrapper =
        await this.issuerKit.contracts.getFederatedAttestations()

      let currentObfuscatedIdentifier = obfuscatedIdentifier || (await this.getObfuscatedIdentifier(identifier!))

      const attestations: {
        countsPerIssuer: string[]
        accounts: Address[]
        signers: Address[]
        issuedOns: string[]
        publishedOns: string[]
      } = await federatedAttestationsContract.lookupAttestations(currentObfuscatedIdentifier, [this.issuer.address])

      if (attestations.accounts.length === 0) {
        return undefined
      }
      return attestations.accounts[0]
    } catch (error) {
      throw `${error}`
    }
  }
}
