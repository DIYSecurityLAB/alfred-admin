// Exportação explícita de todas as interfaces
export interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  providerId?: string;
  isActive: boolean;
  level: number;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilter {
  username?: string;
  status?: 'all' | 'active' | 'inactive';
  level?: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';  // Alterado para corresponder à API
  discountValue: number;
  minPurchaseValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string | null | undefined;  // Atualizado para aceitar undefined também
}

export interface CouponFilter {
  code: string;
  status: 'all' | 'active' | 'inactive';
}

export type CreateCouponDTO = Omit<Coupon, 'id' | 'usedCount'> & {
  validUntil?: string | null; // Explicitamente marcando como opcional
};

export type UpdateCouponDTO = Partial<CreateCouponDTO>;

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

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalUsers: number;
  activeCoupons: number;
  newUsers: number;
  pendingTransactions: number;
  conversionRate: number;
  revenueByDay: {
    date: string;
    revenue: number;
  }[];
  salesByPaymentMethod: {
    method: string;
    count: number;
    value: number;
  }[];
  transactionsByStatus: {
    status: string;
    count: number;
  }[];
  userRegistrationByMonth: {
    month: string;
    count: number;
  }[];
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
}

export interface Settings {
  maintenanceMode: boolean;
  enabledPaymentMethods: {
    method: string;
    enabled: boolean;
  }[];
  emailNotifications: boolean;
}

export type PaymentMethod = 
  | 'PIX' 
  | 'CREDIT_CARD' 
  | 'CRYPTO' 
  | 'CARD'
  | 'BANK_TRANSFER'
  | 'WISE'
  | 'TICKET'
  | 'USDT'
  | 'SWIFT'
  | 'PAYPAL';

export type PaymentStatus = 
  | 'PENDING' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'FAILED'
  | 'pending'
  | 'paid'
  | 'canceled'
  | 'review'
  | 'expired'
  | 'refunded'
  | 'complete';

export interface Deposit {
  id: string;
  transactionId: string;
  phone: string;
  coldWallet: string;
  network: string;
  paymentMethod: PaymentMethod;
  documentId: string | null;
  transactionDate: string;
  cupom: string | null;
  valueBRL: number;
  valueBTC: number;
  status: PaymentStatus;
  username: string | null;
}

export interface DepositReport extends Deposit {
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  valueCollected?: number;
}

export interface DepositFilter {
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  startAt?: string;
  endAt?: string;
  username?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


