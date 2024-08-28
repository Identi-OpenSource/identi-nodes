import { IsNotEmpty, IsString } from 'class-validator'

export class AuthVCResponse {
  @IsNotEmpty()
  @IsString()
  token!: string
}
