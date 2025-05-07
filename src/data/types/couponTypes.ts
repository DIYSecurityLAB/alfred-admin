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
  validUntil?: string | null | undefined;
}

export type CreateCouponDTO = Omit<Coupon, 'id' | 'usedCount'> & {
  validUntil?: string | null;
};

export type UpdateCouponDTO = Partial<CreateCouponDTO>;

export interface CouponFilter {
  code: string;
  status: 'all' | 'active' | 'inactive';
  sort: 'none' | 'most-used' | 'least-used' | 'newest' | 'oldest';
}

export interface Sale {
  id: string;
  userId: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}
