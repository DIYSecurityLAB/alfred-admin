import { ExceptionHandler } from '@/utils/ExceptionHandler';
import { DefaultResultError, Result } from '@/utils/Result';
import { z } from 'zod';
import { RemoteDataSource } from '../datasource/Remote.datasource';
import { BlockUserModel } from '../model/Blacklist.model';
import {
  ListAllBlockedUserModel,
  ListAllUserModel,
  ListedUserModel,
} from '../model/user/user.model';

type BlockReq = BlockUserModel;
type BlockRes = Promise<
  Result<
    {
      id: string;
      userId: string;
      reason: string | undefined;
    },
    | { code: 'SERIALIZATION' | 'NOT_FOUND' | 'ALREADY_EXISTS' }
    | DefaultResultError
  >
>;

type ListBlockedReq = {
  page: number;
  itemsPerPage: number;
  userId: string | undefined;
};
type ListBlockedRes = Promise<
  Result<
    ListAllBlockedUserModel[],
    { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError
  >
>;

type ListReq = {
  page: number;
  itemsPerPage: number;
  userId: string | undefined;
  username: string | undefined;
};
type ListRes = Promise<
  Result<
    ListAllUserModel,
    { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError
  >
>;

type UpdateUserReq = {
  id: string;
  data: {
    username?: string;
    level?: number;
    // Adicionamos os campos opcionais para documents e depositos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    documents?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    depositos?: any[];
  };
};
type UpdateUserRes = Promise<
  Result<
    ListedUserModel,
    { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError
  >
>;

export interface UserRepository {
  list(req: ListReq): ListRes;
  block(req: BlockReq): BlockRes;
  listAllBlocked(req: ListBlockedReq): ListBlockedRes;
  update(req: UpdateUserReq): UpdateUserRes;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly api: RemoteDataSource) {}

  @ExceptionHandler()
  async list(req: ListReq): ListRes {
    const { page, itemsPerPage, userId, username } = req;

    const result = await this.api.post({
      url: `/user/list?offet=${page}&limit=${itemsPerPage}`,
      model: ListAllUserModel,
      body: {
        id: userId,
        username: username,
      },
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }

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

  @ExceptionHandler()
  async listAllBlocked(req: ListBlockedReq): ListBlockedRes {
    const { page, itemsPerPage, userId } = req;

    const result = await this.api.post({
      url: `/user/blocked?offet=${page}&limit=${itemsPerPage}`,
      model: z.array(ListAllBlockedUserModel),
      body: {
        userId: userId,
      },
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }

  @ExceptionHandler()
  async update(req: UpdateUserReq): UpdateUserRes {
    const { id, data } = req;

    // Modificando o formato para corresponder à estrutura esperada pelo controlador
    const result = await this.api.post({
      url: '/user/update',
      model: ListedUserModel,
      body: {
        id: id,
        data: {
          username: data.username,
          level: data.level,
          // Remova os campos documents e depositos que podem estar causando conflitos
        },
      },
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }
}
