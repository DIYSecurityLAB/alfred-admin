import {
  ReportDepositResendReq,
  ReportDepositResendRes,
  ReportRepository,
} from '@/data/repositories/report.repository';
import { Result } from '@/utils/Result';
import { UseCase } from '@/utils/UseCase';

export type DepositResendUseCase = UseCase<
  ReportDepositResendReq,
  ReportDepositResendRes
>;

export class DepositResendUseCaseImpl implements DepositResendUseCase {
  constructor(private repository: ReportRepository) {}

  async execute(req: ReportDepositResendReq): ReportDepositResendRes {
    const { result } = await this.repository.sendOrder(req);

    if (result.type === 'ERROR') {
      switch (result.error.code) {
        case 'SERIALIZATION':
          return Result.Error({ code: 'SERIALIZATION' });
        case 'NOT_FOUND':
          return Result.Error({ code: 'NOT_FOUND' });
        default:
          return Result.Error({ code: 'UNKNOWN_ERROR' });
      }
    }

    return Result.Success(result.data);
  }
}
