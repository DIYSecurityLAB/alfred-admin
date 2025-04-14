import { AxiosError } from 'axios';
import { Result } from './Result';

export function ExceptionHandler() {
  return function (
    _target: object, 
    _propertyKey: string, 
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        console.error('Exception caught:', error);
        
        if (error instanceof AxiosError) {
          switch (error.response?.status) {
            case 401:
              return Result.Error({ code: 'UNAUTHORIZED' });
            case 404:
              return Result.Error({ code: 'NOT_FOUND' });
            case 400:
              return Result.Error({ code: 'BAD_REQUEST' });
            case 409:
              return Result.Error({ code: 'ALREADY_EXISTS' });
            default:
              return Result.Error({ code: 'UNKNOWN_ERROR' });
          }
        }
        
        return Result.Error({ code: 'UNKNOWN_ERROR' });
      }
    };

    return descriptor;
  };
}
