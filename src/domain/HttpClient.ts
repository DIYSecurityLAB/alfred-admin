import { Result } from '../utils/Result';

export class Http {
  public static async checkError(error: Error) {
    if ('code' in error) {
      switch (error.code) {
        case 'EAI_AGAIN':
          return Result.Error({ code: 'NETWORK_ERROR' });
      }
    }
  }
}
