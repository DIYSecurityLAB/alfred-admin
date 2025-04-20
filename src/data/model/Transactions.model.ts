import { z } from 'zod';

export const TransactionStatusEnum = z.enum([
  'pending',
  'paid',
  'canceled',
  'review',
  'expired',
  'refunded',
  'complete',
]);
export type TransactionStatusEnum = z.infer<typeof TransactionStatusEnum>;

export const PaymentMethodEnum = z.enum([
  'PIX',
  'CREDIT_CARD',
  'CRYPTO',
  'BANK_TRANSFER',
]);
export type PaymentMethodEnum = z.infer<typeof PaymentMethodEnum>;

export const CryptoTypeEnum = z.enum(['BTC', 'ETH', 'USDT']);
export type CryptoTypeEnum = z.infer<typeof CryptoTypeEnum>;

export const TransactionModel = z.object({
  id: z.string(),
  transactionId: z.string(),
  valorBRL: z.number(),
  valorBTC: z.number(),
  network: z.string(),
  paymentMethod: PaymentMethodEnum,
  coldWallet: z.string(),
  telefone: z.string(),
  cpfCnpj: z.string().optional(),
  cupom: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  qrCodePaste: z.string().optional(),
  status: TransactionStatusEnum,
  cryptoType: CryptoTypeEnum.optional(),
  userId: z.string().optional(),
  username: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type TransactionModel = z.infer<typeof TransactionModel>;

export const TransactionsListModel = z.object({
  transactions: z.array(TransactionModel),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
  totalPages: z.number().optional(),
});
export type TransactionsListModel = z.infer<typeof TransactionsListModel>;

export const TransactionFilterModel = z.object({
  transactionId: z.string().optional(),
  status: z.union([TransactionStatusEnum, z.literal('all')]).optional(),
  paymentMethod: z.union([PaymentMethodEnum, z.literal('all')]).optional(),
  dateRange: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .optional(),
});
export type TransactionFilterModel = z.infer<typeof TransactionFilterModel>;

export const UpdateTransactionStatusModel = z.object({
  id: z.string(),
  status: TransactionStatusEnum,
});
export type UpdateTransactionStatusModel = z.infer<
  typeof UpdateTransactionStatusModel
>;
