import { AbstractKeyManagementSystem } from '@veramo/key-manager'

interface transferTokensResponse {
  message: string
  transactionHash: string
}

export abstract class IdentiAbstractKeyManagementSystem extends AbstractKeyManagementSystem {
  abstract transferTokens({
    nodeUrl,
    kidFrom,
    addressTo,
    amount,
    contractAddress,
    contractAddressFee,
  }: {
    nodeUrl: string
    kidFrom: string
    addressTo: string
    amount: string
    contractAddress: string
    contractAddressFee: string
  }): Promise<transferTokensResponse>

  abstract balance({
    nodeUrl,
    kid,
    contractAddress,
  }: {
    nodeUrl: string
    kid: string
    contractAddress: string
  }): Promise<string>
}
