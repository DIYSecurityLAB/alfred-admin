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

export enum TransactionStatus {
  pending = 'pending',
  paid = 'paid',
  canceled = 'canceled',
  review = 'review',
  expired = 'expired',
  refunded = 'refunded',
  complete = 'complete'
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  CRYPTO = 'CRYPTO',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum CryptoType {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT'
}

export interface Transaction {
  id: string;
  transactionId: string;
  valorBRL: number;
  valorBTC: number;
  network: string;
  paymentMethod: PaymentMethod;
  coldWallet: string;
  telefone: string;
  cpfCnpj?: string;
  cupom?: string;
  qrCodeUrl?: string;
  qrCodePaste?: string;
  status: TransactionStatus;
  cryptoType?: CryptoType;
  userId?: string;
  username?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilter {
  transactionId?: string;
  status?: TransactionStatus | 'all';
  paymentMethod?: PaymentMethod | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
}