import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

class BiometricMetadataDto {
  [x: string]: any
}

export class AuthVCRequest {
  @IsNotEmpty()
  @IsString()
  identifier!: string

  @IsOptional()
  biometric_metadata?: BiometricMetadataDto
}
