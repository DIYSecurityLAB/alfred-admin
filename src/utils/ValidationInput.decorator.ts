/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodSchema } from 'zod';
import { Result } from './Result';

export function ValidateInputs(schemas: (ZodSchema | null)[]) {
  return function (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      for (let i = 0; i < schemas.length; i++) {
        const schema = schemas[i];
        if (schema) {
          const validation = schema.safeParse(args[i]);

          if (!validation.success) {
            console.log('Validação falhou', validation.error.errors);
            return Result.Error({
              code: 'SERIALIZATION',
              payload: validation.error.errors,
            });
          }
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
