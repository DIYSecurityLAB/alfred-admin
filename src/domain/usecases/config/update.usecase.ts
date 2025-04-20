import { ConfigRepository } from '@/data/repositories/config.repository';
import { Config, UpdateConfig } from '@/domain/entities/Config';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type UpdateReq = UpdateConfig;
export type UpdateRes = Promise<
  Result<
    Config,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type UpdateConfigUseCase = UseCase<UpdateReq, UpdateRes>;

export class UpdateConfigUseCaseImpl implements UpdateConfigUseCase {
  constructor(private readonly repository: ConfigRepository) {}

  async execute(req: UpdateReq): UpdateRes {
    const { result } = await this.repository.update(req);

    if (result.type === 'ERROR') {
      switch (result.error.code) {
        case 'SERIALIZATION':
          return Result.Error({ code: 'SERIALIZATION' });
        case 'NOT_FOUND':
          return Result.Error({ code: 'NOT_FOUND' });
        default:
          return Result.Error({ code: 'UNKNOWN' });
      }
    }

    return Result.Success(result.data);
  }
}
