import { DashboardStats } from "../data/types";

export const mockDashboardStats: DashboardStats = {
  totalSales: 458,
  totalRevenue: 126743.90,
  totalUsers: 1245,
  activeCoupons: 7,
  newUsers: 28,
  pendingTransactions: 12,
  conversionRate: 3.2,
  
  revenueByDay: [
    { date: '2023-11-01', revenue: 5420.50 },
    { date: '2023-11-02', revenue: 6210.75 },
    { date: '2023-11-03', revenue: 4890.20 },
    { date: '2023-11-04', revenue: 5340.90 },
    { date: '2023-11-05', revenue: 7120.30 },
    { date: '2023-11-06', revenue: 6540.80 },
    { date: '2023-11-07', revenue: 5980.40 },
    { date: '2023-11-08', revenue: 6750.60 },
    { date: '2023-11-09', revenue: 7230.10 },
    { date: '2023-11-10', revenue: 8120.90 },
    { date: '2023-11-11', revenue: 7890.40 },
    { date: '2023-11-12', revenue: 6540.20 },
    { date: '2023-11-13', revenue: 5670.30 },
    { date: '2023-11-14', revenue: 6120.80 },
  ],
  
  salesByPaymentMethod: [
    { method: 'PIX', count: 210, value: 54320.50 },
    { method: 'CREDIT_CARD', count: 154, value: 42180.70 },
    { method: 'CRYPTO', count: 62, value: 22150.30 },
    { method: 'BANK_TRANSFER', count: 32, value: 8092.40 }
  ],
  
  transactionsByStatus: [
    { status: 'complete', count: 324 },
    { status: 'pending', count: 56 },
    { status: 'canceled', count: 28 },
    { status: 'review', count: 18 },
    { status: 'paid', count: 24 },
    { status: 'expired', count: 5 },
    { status: 'refunded', count: 3 }
  ],
  
  userRegistrationByMonth: [
    { month: 'Jan', count: 78 },
    { month: 'Feb', count: 92 },
    { month: 'Mar', count: 110 },
    { month: 'Apr', count: 85 },
    { month: 'May', count: 102 },
    { month: 'Jun', count: 118 },
    { month: 'Jul', count: 132 },
    { month: 'Aug', count: 125 },
    { month: 'Sep', count: 140 },
    { month: 'Oct', count: 168 },
    { month: 'Nov', count: 182 },
    { month: 'Dec', count: 13 }
  ],
  
  topProducts: [
    { name: 'Bitcoin Purchase', sales: 210, revenue: 84320.50 },
    { name: 'Ethereum Purchase', sales: 145, revenue: 32180.70 },
    { name: 'USDT Purchase', sales: 62, revenue: 8150.30 },
    { name: 'Premium Wallet', sales: 41, revenue: 2092.40 }
  ]
};
