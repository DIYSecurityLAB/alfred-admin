import { z } from 'zod';

export const PaymentMethodEnum = z.enum([
  'PIX', 
  'CREDIT_CARD', 
  'CRYPTO', 
  'CARD',
  'BANK_TRANSFER',
  'WISE',
  'TICKET',
  'USDT',
  'SWIFT',
  'PAYPAL'
]);

export const PaymentStatusEnum = z.enum([
  'PENDING', 
  'COMPLETED', 
  'CANCELLED', 
  'FAILED',
  'pending',
  'paid',
  'canceled',
  'review',
  'expired',
  'refunded',
  'complete'
]);

export const DepositModel = z.object({
  id: z.string(),
  transactionId: z.string(),
  phone: z.string(),
  coldWallet: z.string(),
  network: z.string(),
  paymentMethod: PaymentMethodEnum,
  documentId: z.string().nullable(),
  transactionDate: z.string(),
  cupom: z.string().nullable().optional(),
  valueBRL: z.number(),
  valueBTC: z.number(),
  status: PaymentStatusEnum,
  username: z.string().nullable().optional(),
  discountType: z.enum(['percentage', 'fixed']).optional(),
  discountValue: z.number().optional(),
  valueCollected: z.number().optional()
});
export type DepositModel = z.infer<typeof DepositModel>;

export const DepositListModel = z.object({
  data: z.array(DepositModel),
  total: z.number().optional().default(0),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  totalPages: z.number().optional().default(1)
});
export type DepositListModel = z.infer<typeof DepositListModel>;

export const DepositFilterModel = z.object({
  status: PaymentStatusEnum.optional(),
  paymentMethod: PaymentMethodEnum.optional(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  username: z.string().optional()
});
export type DepositFilterModel = z.infer<typeof DepositFilterModel>;
