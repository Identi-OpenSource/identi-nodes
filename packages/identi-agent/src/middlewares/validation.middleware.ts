import { ClassConstructor, plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import ValidateFieldsError from '../core/errors/validate-fields.error.js'
import ERROR_TYPES from '../core/constants/error-types.js'
import httpStatus from 'http-status'

function validationMiddleware<T extends object>(
  type: ClassConstructor<T>
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    const input = plainToClass(type, req.body)
    const errors = await validate(input)

    if (errors.length > 0) {
      const formattedErrors = errors?.reduce((acc: any, error: ValidationError) => {
        const constraintKeys = Object.keys(error.constraints || {})
        if (constraintKeys.length > 0) {
          acc[error.property] = error.constraints![constraintKeys[0]]
        }
        return acc
      }, {})

      next(
        new ValidateFieldsError(
          'Validación de parámetros incorrecto',
          ERROR_TYPES.VALIDATE_FIELDS,
          formattedErrors,
          httpStatus.UNPROCESSABLE_ENTITY,
          95
        )
      )
      return
    }
    next()
  }
}

export default validationMiddleware
