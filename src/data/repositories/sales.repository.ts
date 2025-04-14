import { DefaultResultError, Result } from '../../utils/Result';
import { remoteDataSource } from '../datasource/Remote.datasource';
import { 
  SaleModel, 
  SalesListModel, 
  UpdateSaleStatusModel 
} from '../model/Sales.model';

// Tipos de requisição e resposta
export type GetSalesReq = {
  page: number;
  limit: number;
};
export type GetSalesRes = Promise<
  Result<SalesListModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type GetSaleReq = {
  id: string;
};
export type GetSaleRes = Promise<
  Result<SaleModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type UpdateSaleStatusReq = UpdateSaleStatusModel;
export type UpdateSaleStatusRes = Promise<
  Result<SaleModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

// Interface do repositório
export interface SalesRepository {
  getSales(req: GetSalesReq): GetSalesRes;
  getSaleById(req: GetSaleReq): GetSaleRes;
  updateSaleStatus(req: UpdateSaleStatusReq): UpdateSaleStatusRes;
}

// Implementação do repositório
export class SalesRepositoryImpl implements SalesRepository {
  constructor(private api = remoteDataSource) {}

  async getSales({ page, limit }: GetSalesReq): GetSalesRes {
    try {
      const result = await this.api.get({
        url: `/sales?page=${page}&limit=${limit}`,
        model: SalesListModel,
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      return Result.Success(result);
    } catch (error) {
      console.error('Error getting sales:', error);
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async getSaleById({ id }: GetSaleReq): GetSaleRes {
    try {
      const result = await this.api.get({
        url: `/sales/${id}`,
        model: SaleModel,
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      return Result.Success(result);
    } catch (error) {
      console.error('Error getting sale by ID:', error);
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async updateSaleStatus({ id, status }: UpdateSaleStatusReq): UpdateSaleStatusRes {
    try {
      const result = await this.api.patch({
        url: `/sales/${id}`,
        model: SaleModel,
        body: { status },
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      return Result.Success(result);
    } catch (error) {
      console.error('Error updating sale status:', error);
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

// Singleton instance
export const salesRepository = new SalesRepositoryImpl();