import { z } from 'zod';

export const DashboardStatsModel = z.object({
  totalSales: z.number(),
  totalRevenue: z.number(),
  totalUsers: z.number(),
  activeCoupons: z.number(),
  newUsers: z.number(),
  pendingTransactions: z.number(),
  conversionRate: z.number(),
  revenueByDay: z.array(
    z.object({
      date: z.string(),
      revenue: z.number(),
    }),
  ),
  salesByPaymentMethod: z.array(
    z.object({
      method: z.string(),
      count: z.number(),
      value: z.number(),
    }),
  ),
  transactionsByStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
    }),
  ),
  userRegistrationByMonth: z.array(
    z.object({
      month: z.string(),
      count: z.number(),
    }),
  ),
  topProducts: z.array(
    z.object({
      name: z.string(),
      sales: z.number(),
      revenue: z.number(),
    }),
  ),
});
export type DashboardStatsModel = z.infer<typeof DashboardStatsModel>;
