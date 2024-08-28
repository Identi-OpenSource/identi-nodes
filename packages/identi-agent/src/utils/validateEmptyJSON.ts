import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsNotEmptyObject(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsNotEmptyObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value && Object.keys(value).length > 0
        },
        defaultMessage(args: ValidationArguments) {
          return 'Property $property should not be an empty object'
        },
      },
    })
  }
}
