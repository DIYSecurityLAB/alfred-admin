import { ReportRepository } from '@/data/repositories/report.repository';
import { ReportedDepositPagination } from '@/domain/entities/report.entity';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type ListReq = {
  page?: number;
  pageSize?: number;
  status?: 'paid' | 'expired' | 'pending' | 'canceled';
  startAt?: string;
  endAt?: string;
};
export type ListRes = Promise<
  Result<
    ReportedDepositPagination,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type ReportDepositPaginatedUseCase = UseCase<ListReq, ListRes>;

export class ReportDepositPaginatedUseCaseImpl
  implements ReportDepositPaginatedUseCase
{
  constructor(private repository: ReportRepository) {}

  async execute(req: ListReq): ListRes {
    const { result } = await this.repository.listAllPaginated({
      page: req.page,
      pageSize: req.pageSize,
      status: req.status,
      endAt: req.endAt,
      startAt: req.startAt,
    });

    if (result.type === 'ERROR') {
      switch (result.error.code) {
        case 'NOT_FOUND':
          return Result.Error({ code: 'NOT_FOUND' });
        case 'SERIALIZATION':
          return Result.Error({ code: 'SERIALIZATION' });
        default:
          return Result.Error({ code: 'UNKNOWN' });
      }
    }

    return Result.Success(ReportedDepositPagination.fromModel(result.data));
  }
}
