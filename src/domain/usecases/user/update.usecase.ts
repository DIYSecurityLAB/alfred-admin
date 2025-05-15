import { UserRepository } from '@/data/repositories/user.repository';
import { ListedUser } from '@/domain/entities/User';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type UpdateUserReq = {
  id: string;
  data: {
    username?: string;
    level?: number;
    // Campos adicionais para manter a compatibilidade com a API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    documents?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    depositos?: any[];
  };
};

export type UpdateUserRes = Promise<
  Result<
    ListedUser,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type UpdateUserUseCase = UseCase<UpdateUserReq, UpdateUserRes>;

export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(req: UpdateUserReq): UpdateUserRes {
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

    return Result.Success(ListedUser.fromModel(result.data));
  }
}
