import { IsArray, IsNotEmpty, ArrayNotEmpty, IsString, Matches, IsOptional, IsBoolean, IsUUID } from 'class-validator'
import { IsNotEmptyObject } from '../../../utils/validateEmptyJSON.js'
import { IsDIDFormat } from '../../../utils/validateDID.js'

class CredentialSubjectDto {
  [x: string]: any
}

export class CreateDIDRequest {
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  identifiers!: string[]
}

export class IssueVerifiableCredentialRequest {
  @IsNotEmpty()
  @IsString()
  identifier!: string

  @IsNotEmptyObject()
  credential_subject!: CredentialSubjectDto

  @IsNotEmpty()
  @IsString()
  credential_type!: string

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+[ymd]$/, {
    message: 'valid_period must be a number followed by y, m, or d',
  })
  valid_period!: string

  @IsOptional()
  @IsBoolean()
  is_return_hash?: boolean
}

export class ShareVerifiableCredentialRequest {
  @IsNotEmpty()
  @IsUUID()
  verifiable_credential_id!: string
}
