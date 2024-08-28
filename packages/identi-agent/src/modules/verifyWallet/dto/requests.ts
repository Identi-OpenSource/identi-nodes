import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator'

enum ValidationType {
  VALIDATE_ONLY_DID_WALLET = 'VALIDATE_ONLY_DID_WALLET',
  VALIDATE_DID_AND_CRYPTO_WALLETS = 'VALIDATE_DID_AND_CRYPTO_WALLETS',
}

export class VerifyWalletRequest {
  @IsNotEmpty()
  @IsString()
  identifier!: string

  @IsOptional()
  @IsEnum(ValidationType)
  validation_type!: ValidationType
}
