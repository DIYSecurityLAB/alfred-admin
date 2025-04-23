import { ReportRepository } from '@/data/repositories/report.repository';
import { ReportedDeposit } from '@/domain/entities/report.entity';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type ListReq = {
  id: string;
};
export type ListRes = Promise<
  Result<
    ReportedDeposit,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type ReportDepositOneUseCase = UseCase<ListReq, ListRes>;

export class ReportDepositOneUseCaseImpl implements ReportDepositOneUseCase {
  constructor(private repository: ReportRepository) {}

  async execute(req: ListReq): ListRes {
    const { result } = await this.repository.listOne({
      id: req.id,
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

    return Result.Success(ReportedDeposit.fromModel(result.data));
  }
}
