import { ConfigRepository } from '@/data/repositories/config.repository';
import { Config } from '@/domain/entities/Config';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type ListReq = object;
export type ListRes = Promise<
  Result<
    Config,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type ListConfigUseCase = UseCase<ListReq, ListRes>;

export class ListConfigUseCaseImpl implements ListConfigUseCase {
  constructor(private readonly repository: ConfigRepository) {}

  async execute(): ListRes {
    const { result } = await this.repository.list();

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
