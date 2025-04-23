import { ExceptionHandler } from '@/utils/ExceptionHandler';
import { Result } from '@/utils/Result';
import { DefaultResultError } from '@/utils/ResultOld';
import { z } from 'zod';
import { RemoteDataSource } from '../datasource/Remote.datasource';
import {
  ReportedDepositModel,
  ReportedDepositPaginationModel,
} from '../model/report.model';

export type ReportDepositPaginatedReq = {
  page: number;
  pageSize: number;
  status?: 'paid' | 'expired' | 'pending' | 'canceled' | 'complete';
  startAt?: string;
  endAt?: string;
};
export type ReportDepositPaginatedRes = Promise<
  Result<
    ReportedDepositPaginationModel,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type ReportDepositRes = Promise<
  Result<
    ReportedDepositModel[],
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export type ReportDepositListOneReq = {
  id: string;
};
export type ReportDepositListOneRes = Promise<
  Result<
    ReportedDepositModel,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export interface ReportRepository {
  listOne(req: ReportDepositListOneReq): ReportDepositListOneRes;
  listAll(): ReportDepositRes;
  listAllPaginated(req: ReportDepositPaginatedReq): ReportDepositPaginatedRes;
}

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private api: RemoteDataSource) {}

  @ExceptionHandler()
  async listOne(req: ReportDepositListOneReq): ReportDepositListOneRes {
    const result = await this.api.get({
      url: `/report/deposit/${req.id}`,
      model: ReportedDepositModel,
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }

  @ExceptionHandler()
  async listAll(): ReportDepositRes {
    const result = await this.api.get({
      url: `/report/deposit`,
      model: z.array(ReportedDepositModel),
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }

  @ExceptionHandler()
  async listAllPaginated(
    req: ReportDepositPaginatedReq,
  ): ReportDepositPaginatedRes {
    const params = new URLSearchParams();
    params.append('page', String(req.page));
    params.append('pageSize', String(req.pageSize));

    if (req.status) {
      params.append('status', req.status);
    }

    if (req.startAt) {
      params.append('startAt', req.startAt);
    }

    if (req.endAt) {
      params.append('endAt', req.endAt);
    }

    const result = await this.api.get({
      url: `/report/deposit/pagination?${params.toString()}`,
      model: ReportedDepositPaginationModel,
    });

    if (!result) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(result);
  }
}
