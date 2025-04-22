import { UserRepository } from '@/data/repositories/user.repository';
import { ListAllBlockedUser } from '@/domain/entities/User';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type ListAllReq = {
  page: number;
  itemsPerPage: number;
  userId: string | undefined;
};
export type ListAllRes = Promise<
  Result<
    ListAllBlockedUser[],
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type ListBlockedUserUseCase = UseCase<ListAllReq, ListAllRes>;

export class ListBlockedUserUseCaseImpl implements ListBlockedUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(req: ListAllReq): ListAllRes {
    const { result } = await this.repository.listAllBlocked(req);

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

    return Result.Success(
      result.data.map((item) => ListAllBlockedUser.fromModel(item)),
    );
  }
}
