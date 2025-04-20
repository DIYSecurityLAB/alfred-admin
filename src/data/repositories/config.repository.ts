import { ExceptionHandler } from '@/utils/ExceptionHandler';
import { DefaultResultError, Result } from '@/utils/Result';
import { RemoteDataSource } from '../datasource/Remote.datasource';
import { ConfigModel } from '../model/Config.model';

type ListRes = Promise<
  Result<
    ConfigModel,
    { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError
  >
>;

type UpdateReq = Partial<ConfigModel>;
type UpdateRes = Promise<
  Result<
    ConfigModel,
    { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError
  >
>;

export interface ConfigRepository {
  list(): ListRes;
  update(config: UpdateReq): UpdateRes;
}

export class ConfigRepositoryImpl implements ConfigRepository {
  constructor(private readonly api: RemoteDataSource) {}

  @ExceptionHandler()
  async list(): ListRes {
    const result = await this.api.get({
      url: '/config',
      model: ConfigModel,
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }

  @ExceptionHandler()
  async update(config: UpdateReq): UpdateRes {
    const result = await this.api.patch({
      url: '/config',
      model: ConfigModel,
      body: config,
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }
}
