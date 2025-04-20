import { AxiosError } from 'axios';
import { ResultOld } from './ResultOld';

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
              return ResultOld.Error({ code: 'UNAUTHORIZED' });
            case 404:
              return ResultOld.Error({ code: 'NOT_FOUND' });
            case 400:
              return ResultOld.Error({ code: 'BAD_REQUEST' });
            case 409:
              return ResultOld.Error({ code: 'ALREADY_EXISTS' });
            default:
              return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
          }
        }
        
        return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
      }
    };

    return descriptor;
  };
}
