import { DefaultResultError, Result } from '../../utils/Result';
import { remoteDataSource } from '../datasource/Remote.datasource';
import { 
  TransactionFilterModel,
  TransactionModel,
  TransactionsListModel,
  UpdateTransactionStatusModel
} from '../model/Transactions.model';

// Tipos de requisição e resposta
export type GetTransactionsReq = {
  page: number;
  limit: number;
  filters?: TransactionFilterModel;
};
export type GetTransactionsRes = Promise<
  Result<TransactionsListModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type GetTransactionReq = {
  id: string;
};
export type GetTransactionRes = Promise<
  Result<TransactionModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type UpdateTransactionStatusReq = UpdateTransactionStatusModel;
export type UpdateTransactionStatusRes = Promise<
  Result<TransactionModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

// Interface do repositório
export interface TransactionsRepository {
  getTransactions(req: GetTransactionsReq): GetTransactionsRes;
  getTransactionById(req: GetTransactionReq): GetTransactionRes;
  updateTransactionStatus(req: UpdateTransactionStatusReq): UpdateTransactionStatusRes;
}

// Implementação do repositório
export class TransactionsRepositoryImpl implements TransactionsRepository {
  constructor(private api = remoteDataSource) {}

  async getTransactions({ page, limit, filters }: GetTransactionsReq): GetTransactionsRes {
    try {
      let url = `/transactions?page=${page}&limit=${limit}`;
      
      if (filters) {
        if (filters.transactionId) url += `&transactionId=${filters.transactionId}`;
        if (filters.status && filters.status !== 'all') url += `&status=${filters.status}`;
        if (filters.paymentMethod && filters.paymentMethod !== 'all') url += `&paymentMethod=${filters.paymentMethod}`;
        if (filters.dateRange) {
          url += `&startDate=${filters.dateRange.start}&endDate=${filters.dateRange.end}`;
        }
      }
      
      const result = await this.api.get({
        url,
        model: TransactionsListModel,
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      return Result.Success(result);
    } catch (error) {
      console.error('Error getting transactions:', error);
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async getTransactionById({ id }: GetTransactionReq): GetTransactionRes {
    try {
      const result = await this.api.get({
        url: `/transactions/${id}`,
        model: TransactionModel,
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      return Result.Success(result);
    } catch (error) {
      console.error('Error getting transaction by ID:', error);
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async updateTransactionStatus({ id, status }: UpdateTransactionStatusReq): UpdateTransactionStatusRes {
    try {
      const result = await this.api.patch({
        url: `/transactions/${id}/status`,
        model: TransactionModel,
        body: { status },
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      return Result.Success(result);
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

// Singleton instance
export const transactionsRepository = new TransactionsRepositoryImpl();
