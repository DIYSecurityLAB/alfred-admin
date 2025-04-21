import { z } from 'zod';
import { DefaultResultError, ResultOld } from '../../../utils/ResultOld';
import { remoteDataSourceOld } from '../../datasource/RemoteOld.datasource';
import { DepositListModel, DepositModel } from '../../model/Old/Reports.model';

export type GetAllReportsRes = Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResultOld<any[], { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type GetPaginatedReportsReq = {
  page: number;
  pageSize: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any;
};

export type GetPaginatedReportsRes = Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResultOld<any, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type GetReportByIdReq = {
  id: string;
};

export type GetReportByIdRes = Promise<
  ResultOld<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError
  >
>;

export interface ReportRepository {
  getAll(): GetAllReportsRes;
  getPaginated(req: GetPaginatedReportsReq): GetPaginatedReportsRes;
  getById(req: GetReportByIdReq): GetReportByIdRes;
}

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private api = remoteDataSourceOld) {}

  async getAll(): GetAllReportsRes {
    try {
      const result = await this.api.get({
        url: '/report/deposit',
        model: z.array(DepositModel),
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedData: any[] = result.map((item) => ({
        id: item.id,
        transactionId: item.transactionId,
        phone: item.phone,
        coldWallet: item.coldWallet,
        network: item.network,
        paymentMethod: item.paymentMethod,
        documentId: item.documentId,
        transactionDate: item.transactionDate,
        cupom: item.cupom || null,
        valueBRL: item.valueBRL,
        valueBTC: item.valueBTC,
        status: item.status,
        username: item.username || null,
        discountType: item.discountType,
        discountValue: item.discountValue,
        valueCollected: item.valueCollected,
      }));

      return ResultOld.Success(normalizedData);
    } catch (error) {
      console.error('Error getting all reports:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async getPaginated(req: GetPaginatedReportsReq): GetPaginatedReportsRes {
    try {
      let url = `/report/deposit/pagination?page=${req.page}&pageSize=${req.pageSize}`;

      if (req.filters) {
        const { status, paymentMethod, startAt, endAt, username } = req.filters;

        if (status) url += `&status=${status}`;
        if (paymentMethod) url += `&paymentMethod=${paymentMethod}`;
        if (startAt) url += `&startAt=${startAt}`;
        if (endAt) url += `&endAt=${endAt}`;
        if (username) url += `&username=${username}`;
      }

      const result = await this.api.get({
        url,
        model: DepositListModel,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedData: any[] = (result.data || []).map((item) => ({
        id: item.id,
        transactionId: item.transactionId,
        phone: item.phone,
        coldWallet: item.coldWallet,
        network: item.network,
        paymentMethod: item.paymentMethod,
        documentId: item.documentId,
        transactionDate: item.transactionDate,
        cupom: item.cupom || null,
        valueBRL: item.valueBRL,
        valueBTC: item.valueBTC,
        status: item.status,
        username: item.username || null,
        discountType: item.discountType,
        discountValue: item.discountValue,
        valueCollected: item.valueCollected,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paginatedResponse: any = {
        data: normalizedData,
        total: result.total || 0,
        page: result.page || 1,
        pageSize: result.pageSize || 10,
        totalPages: result.totalPages || 1,
      };

      return ResultOld.Success(paginatedResponse);
    } catch (error) {
      console.error('Error getting paginated reports:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async getById(req: GetReportByIdReq): GetReportByIdRes {
    try {
      const result = await this.api.get({
        url: `/report/deposit/${req.id}`,
        model: DepositModel,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedData: any = {
        id: result.id,
        transactionId: result.transactionId,
        phone: result.phone,
        coldWallet: result.coldWallet,
        network: result.network,
        paymentMethod: result.paymentMethod,
        documentId: result.documentId,
        transactionDate: result.transactionDate,
        cupom: result.cupom || null,
        valueBRL: result.valueBRL,
        valueBTC: result.valueBTC,
        status: result.status,
        username: result.username || null,
        discountType: result.discountType,
        discountValue: result.discountValue,
        valueCollected: result.valueCollected,
      };

      return ResultOld.Success(normalizedData);
    } catch (error) {
      console.error('Error getting report by id:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

export const reportRepository = new ReportRepositoryImpl();
