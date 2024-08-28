import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsDIDFormat(validationOptions?: ValidationOptions) {
  const didFormats: RegExp[] = [/^did:ethr:celo:0x[a-fA-F0-9]{66}$/]
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDIDFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && didFormats.some((format) => format.test(value))
        },
        defaultMessage(args: ValidationArguments) {
          return 'Property $property must be in a valid DID format like did:ethr:celo:0x12...'
        },
      },
    })
  }
}
