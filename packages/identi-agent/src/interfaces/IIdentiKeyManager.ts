import { IKeyManager } from '@veramo/core'

interface transferTokensResponse {
  message: string
  transactionHash: string
}
export interface IIdentiKeyManager extends IKeyManager {
  transferTokens({
    nodeUrl,
    kms,
    kidFrom,
    kidTo,
    amount,
    contractAddress,
    contractAddressFee,
  }: {
    nodeUrl: string
    kms: string
    kidFrom: string
    kidTo: string
    amount: string
    contractAddress: string
    contractAddressFee: string
  }): Promise<transferTokensResponse>
  balance({
    nodeUrl,
    kms,
    kid,
    contractAddress,
  }: {
    nodeUrl: string
    kms: string
    kid: string
    contractAddress: string
  }): Promise<string>
}
