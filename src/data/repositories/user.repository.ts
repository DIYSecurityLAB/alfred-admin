import { ExceptionHandler } from '@/utils/ExceptionHandler';
import { DefaultResultError, Result } from '@/utils/Result';
import { z } from 'zod';
import { RemoteDataSource } from '../datasource/Remote.datasource';
import { BlockUserModel } from '../model/Blacklist.model';

type BlockReq = BlockUserModel;
type BlockRes = Promise<
  Result<object, { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError>
>;

export interface UserRepository {
  block(req: BlockReq): BlockRes;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly api: RemoteDataSource) {}

  @ExceptionHandler()
  async block(req: BlockReq): BlockRes {
    const result = await this.api.patch({
      url: '/blacklist',
      model: z.object({}),
      body: req,
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }
}
