import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator'

export class CryptoWalletRequest {
  @IsNotEmpty()
  @IsString()
  identifier!: string
}
export class TransferTokensRequest {
  @IsNotEmpty()
  @IsString()
  identifierTo!: string

  @IsNotEmpty()
  @IsNumber()
  amount!: number
}
