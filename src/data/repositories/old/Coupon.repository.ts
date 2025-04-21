import { z } from 'zod';
import { DefaultResultError, ResultOld } from '../../../utils/ResultOld';
import { remoteDataSourceOld } from '../../datasource/RemoteOld.datasource';
import {
  FilterCouponsModel,
  InsertCouponModel,
  InsertedCouponModel,
  ListCouponsModel,
  ListedAllCouponsModel,
  ListedCouponModel,
  ToggleCouponStatusModel,
  ToggledCouponStatusModel,
  ValidateCouponResultModel,
} from '../../model/Old/Coupons.model';

export type InsertReq = InsertCouponModel;
export type InsertRes = Promise<
  ResultOld<
    InsertedCouponModel,
    | { code: 'BAD_REQUEST' }
    | { code: 'ALREADY_EXISTS' }
    | { code: 'SERIALIZATION' }
    | DefaultResultError
  >
>;

export type ListALLReq = {
  page: number;
  limit: number;
  filters?: FilterCouponsModel;
};
export type ListALLRes = Promise<
  ResultOld<
    ListedAllCouponsModel,
    { code: 'SERIALIZATION' } | DefaultResultError
  >
>;

export type ListOneReq = ListCouponsModel;
export type ListOneRes = Promise<
  ResultOld<ListedCouponModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type ToggleStatusReq = ToggleCouponStatusModel;
export type ToggleStatusRes = Promise<
  ResultOld<
    ToggledCouponStatusModel,
    { code: 'SERIALIZATION' } | DefaultResultError
  >
>;

export type DeleteReq = { id: string };
export type DeleteRes = Promise<
  ResultOld<void, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export interface CouponRepository {
  toggleStatus(req: ToggleStatusReq): ToggleStatusRes;
  listAll(req: ListALLReq): ListALLRes;
  listOne(req: ListOneReq): ListOneRes;
  insert(req: InsertReq): InsertRes;
  update(id: string, data: Partial<InsertReq>): InsertRes;
  isValid(
    code: string,
  ): Promise<
    ResultOld<
      ValidateCouponResultModel,
      { code: 'SERIALIZATION' } | DefaultResultError
    >
  >;
  delete(req: DeleteReq): DeleteRes;
}

export class CouponRepositoryImpl implements CouponRepository {
  constructor(private api = remoteDataSourceOld) {}

  async toggleStatus(req: ToggleStatusReq): ToggleStatusRes {
    try {
      const result = await this.api.patch({
        url: `/coupons/toggle-status`,
        model: ToggledCouponStatusModel,
        body: req,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async listAll(req: ListALLReq): ListALLRes {
    try {
      let url = `/coupons/list-all?page=${req.page}&limit=${req.limit}`;

      if (req.filters?.code) url += `&code=${req.filters.code}`;
      if (req.filters?.status && req.filters.status !== 'all') {
        url += `&isActive=${req.filters.status === 'active'}`;
      }

      const result = await this.api.get({
        url,
        model: ListedAllCouponsModel,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      console.log('API response structure:', Object.keys(result));
      console.log('Data count:', result.data?.length || 0);

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error listing coupons:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async listOne(req: ListOneReq): ListOneRes {
    try {
      const result = await this.api.get({
        url: `/coupons/list/${req.id}`,
        model: ListedCouponModel,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error getting coupon:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async insert(req: InsertReq): InsertRes {
    try {
      const result = await this.api.post({
        url: `/coupons/insert`,
        model: InsertedCouponModel,
        body: req,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error inserting coupon:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async update(id: string, data: Partial<InsertReq>): InsertRes {
    try {
      const result = await this.api.patch({
        url: `/coupons/update`,
        model: InsertedCouponModel,
        body: { id, data },
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error updating coupon:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async isValid(
    code: string,
  ): Promise<
    ResultOld<
      ValidateCouponResultModel,
      { code: 'SERIALIZATION' } | DefaultResultError
    >
  > {
    try {
      const result = await this.api.post({
        url: `/coupons/is-valid`,
        model: ValidateCouponResultModel,
        body: { code },
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error validating coupon:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async delete(req: DeleteReq): DeleteRes {
    try {
      await this.api.delete({
        url: `/coupons/${req.id}`,
        model: z.object({}),
      });

      return ResultOld.Success(undefined);
    } catch (error) {
      console.error('Error deleting coupon:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

// Singleton instance
export const couponRepository = new CouponRepositoryImpl();
