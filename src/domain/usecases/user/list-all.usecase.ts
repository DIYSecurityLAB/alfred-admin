import { UserRepository } from '@/data/repositories/user.repository';
import { ListAllUser, ListedUser } from '@/domain/entities/User';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type ListAllReq = {
  page: number;
  itemsPerPage: number;
  userId: string | undefined;
};
export type ListAllRes = Promise<
  Result<
    ListAllUser,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type ListAllUserCase = UseCase<ListAllReq, ListAllRes>;

export class ListAllUserCaseImpl implements ListAllUserCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(req: ListAllReq): ListAllRes {
    const { result } = await this.repository.list(req);

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

    return Result.Success({
      data: result.data.data.map((user) => {
        return ListedUser.fromModel(user);
      }),
      page: result.data.page,
      itemsPerPage: result.data.itemsPerPage,
      totalPages: result.data.totalPages,
    });
  }
}
