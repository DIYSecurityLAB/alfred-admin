import { ReportRepository } from '@/data/repositories/report.repository';
import { ReportedDeposit } from '@/domain/entities/report.entity';
import { DefaultResultError, Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type ListReq = object;
export type ListRes = Promise<
  Result<
    ReportedDeposit[],
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type ReportDepositAllUseCase = UseCase<ListReq, ListRes>;

export class ReportDepositAllUseCaseImpl implements ReportDepositAllUseCase {
  constructor(private repository: ReportRepository) {}

  async execute(): ListRes {
    const { result } = await this.repository.listAll();

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

    return Result.Success(
      result.data.map((item) => ReportedDeposit.fromModel(item)),
    );
  }
}
