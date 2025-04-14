import { ExceptionHandler } from '../../utils/ExceptionHandler';
import { DefaultResultError, Result } from '../../utils/Result';
import { remoteDataSource } from '../datasource/Remote.datasource';
import {
  DepositFilterModel,
  DepositListModel,
  DepositModel
} from '../model/Reports.model';
import { DepositFilter, PaginatedResponse, DepositReport } from '../types';
import { z } from 'zod';

export type GetAllReportsRes = Promise<
  Result<DepositReport[], { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type GetPaginatedReportsReq = {
  page: number;
  pageSize: number;
  filters?: DepositFilter;
};

export type GetPaginatedReportsRes = Promise<
  Result<PaginatedResponse<DepositReport>, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type GetReportByIdReq = {
  id: string;
};

export type GetReportByIdRes = Promise<
  Result<DepositReport, { code: 'SERIALIZATION' } | { code: 'NOT_FOUND' } | DefaultResultError>
>;

export interface ReportRepository {
  getAll(): GetAllReportsRes;
  getPaginated(req: GetPaginatedReportsReq): GetPaginatedReportsRes;
  getById(req: GetReportByIdReq): GetReportByIdRes;
}

export class ReportRepositoryImpl implements ReportRepository {
  constructor(private api = remoteDataSource) {}

  async getAll(): GetAllReportsRes {
    try {
      const result = await this.api.get({
        url: '/report/deposit',
        model: z.array(DepositModel),
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      // Garantir que os tipos correspondam à interface DepositReport
      const normalizedData: DepositReport[] = result.map(item => ({
        id: item.id,
        transactionId: item.transactionId,
        phone: item.phone,
        coldWallet: item.coldWallet,
        network: item.network,
        paymentMethod: item.paymentMethod,
        documentId: item.documentId,
        transactionDate: item.transactionDate,
        cupom: item.cupom || null, // Normalizar para evitar undefined
        valueBRL: item.valueBRL,
        valueBTC: item.valueBTC,
        status: item.status,
        username: item.username || null, // Normalizar para evitar undefined
        discountType: item.discountType,
        discountValue: item.discountValue,
        valueCollected: item.valueCollected
      }));

      return Result.Success(normalizedData);
    } catch (error) {
      console.error('Error getting all reports:', error);
      // Corrigindo o tratamento de erro
      return Result.Error({ code: 'UNKNOWN_ERROR' });
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
        return Result.Error({ code: 'SERIALIZATION' });
      }

      // Normalizar os dados para garantir compatibilidade de tipos
      const normalizedData: DepositReport[] = (result.data || []).map(item => ({
        id: item.id,
        transactionId: item.transactionId,
        phone: item.phone,
        coldWallet: item.coldWallet,
        network: item.network,
        paymentMethod: item.paymentMethod,
        documentId: item.documentId,
        transactionDate: item.transactionDate,
        cupom: item.cupom || null, // Normalizar para evitar undefined
        valueBRL: item.valueBRL,
        valueBTC: item.valueBTC,
        status: item.status,
        username: item.username || null, // Normalizar para evitar undefined
        discountType: item.discountType,
        discountValue: item.discountValue,
        valueCollected: item.valueCollected
      }));

      // Garantindo que o resultado corresponda ao tipo esperado
      const paginatedResponse: PaginatedResponse<DepositReport> = {
        data: normalizedData,
        total: result.total || 0,
        page: result.page || 1,
        pageSize: result.pageSize || 10,
        totalPages: result.totalPages || 1
      };

      return Result.Success(paginatedResponse);
    } catch (error) {
      console.error('Error getting paginated reports:', error);
      // Corrigindo o tratamento de erro
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async getById(req: GetReportByIdReq): GetReportByIdRes {
    try {
      const result = await this.api.get({
        url: `/report/deposit/${req.id}`,
        model: DepositModel,
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      // Normalizar o resultado para garantir compatibilidade com a interface
      const normalizedData: DepositReport = {
        id: result.id,
        transactionId: result.transactionId,
        phone: result.phone,
        coldWallet: result.coldWallet,
        network: result.network,
        paymentMethod: result.paymentMethod,
        documentId: result.documentId,
        transactionDate: result.transactionDate,
        cupom: result.cupom || null, // Normalizar para evitar undefined
        valueBRL: result.valueBRL,
        valueBTC: result.valueBTC,
        status: result.status,
        username: result.username || null, // Normalizar para evitar undefined
        discountType: result.discountType,
        discountValue: result.discountValue,
        valueCollected: result.valueCollected
      };

      return Result.Success(normalizedData);
    } catch (error) {
      console.error('Error getting report by id:', error);
      // Corrigindo o tratamento de erro
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

// Singleton instance
export const reportRepository = new ReportRepositoryImpl();
