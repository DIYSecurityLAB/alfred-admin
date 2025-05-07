import { SwapPegTransaction } from '@/domain/entities/report.entity';

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
  cupom: string | null | undefined;
  valueBRL: number;
  valueBTC: number;
  status: PaymentStatus;
  username: string | null | undefined;
  swapPegTransaction: SwapPegTransaction[];
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
