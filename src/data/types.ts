export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil?: string | null;
}

export interface CreateCouponDTO {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  isActive?: boolean;
  validFrom: string;
  validUntil?: string | null;
}

export interface UpdateCouponDTO {
  code?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minPurchaseValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  isActive?: boolean;
  validFrom?: string;
  validUntil?: string | null;
}

export interface CouponFilter {
  code: string;
  status: 'all' | 'active' | 'inactive';
  sort: 'none' | 'most-used' | 'least-used' | 'newest' | 'oldest';
}