import { ExceptionHandler } from '@/utils/ExceptionHandler';
import { DefaultResultError, Result } from '@/utils/Result';
import { z } from 'zod';
import { RemoteDataSource } from '../datasource/Remote.datasource';
import { BlockUserModel } from '../model/Blacklist.model';

type BlockReq = BlockUserModel;
type BlockRes = Promise<
  Result<
    {
      id: string;
      userId: string;
      reason: string;
    },
    { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError
  >
>;

export interface UserRepository {
  block(req: BlockReq): BlockRes;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly api: RemoteDataSource) {}

  @ExceptionHandler()
  async block(req: BlockReq): BlockRes {
    const result = await this.api.post({
      url: '/blacklist',
      model: z.object({
        id: z.string(),
        userId: z.string(),
        reason: z.string(),
      }),
      body: req,
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }
}
