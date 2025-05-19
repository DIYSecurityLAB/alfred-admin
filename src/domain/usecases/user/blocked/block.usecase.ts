import { UserRepository } from '@/data/repositories/user.repository';
import { BlockUser } from '@/domain/entities/User';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';
import { ValidateInputs } from '@/utils/ValidationInput.decorator';

export type BlockReq = BlockUser;
export type UpdateRes = Promise<
  Result<
    object,
    | { code: 'SERIALIZATION' }
    | { code: 'NOT_FOUND' }
    | { code: 'ALREADY_EXISTS' }
    | DefaultResultError
  >
>;

export type BlockUserUseCase = UseCase<BlockReq, UpdateRes>;

export class BlockUserUseCaseImpl implements BlockUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  @ValidateInputs([BlockUser])
  async execute(req: BlockReq): UpdateRes {
    const { result } = await this.repository.block(req);

    if (result.type === 'ERROR') {
      switch (result.error.code) {
        case 'SERIALIZATION':
          return Result.Error({ code: 'SERIALIZATION' });
        case 'NOT_FOUND':
          return Result.Error({ code: 'NOT_FOUND' });
        case 'ALREADY_EXISTS':
          return Result.Error({ code: 'ALREADY_EXISTS' });
        default:
          return Result.Error({ code: 'UNKNOWN' });
      }
    }

    return Result.Success(result.data);
  }
}
