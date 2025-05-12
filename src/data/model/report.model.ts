import { z } from 'zod';
import { CryptoTypeModel, PaymentStatusModel } from './user/user.model';

export const SwapPegTransactionModel = z.object({
  id: z.number(),
  PegId: z.string().optional().nullable(),
  LiquidTxId: z.string().nullable(),
  MempoolTxId: z.string().nullable(),
});

export const ReportedDepositModel = z.object({
  id: z.string().min(1),
  transactionId: z.string().min(1),
  coldWallet: z.string(),
  network: z.string(),
  paymentMethod: z.string(),
  userId: z.string().nullable(),
  cryptoType: CryptoTypeModel.nullable().optional(),
  transactionDate: z.string(),
  cupom: z.string().optional().nullable(),
  cryptoValue: z.number().optional(),
  amount: z.number(),
  status: PaymentStatusModel,
  username: z.string().optional().nullable(),
  discountType: z.string().optional().nullable(),
  discountValue: z
    .number()
    .nullable()
    .optional()
    .transform((val) => val ?? 0),
  valueCollected: z.number().optional(),
  SwapPegTransaction: z.array(SwapPegTransactionModel).optional(),
});
export type ReportedDepositModel = z.infer<typeof ReportedDepositModel>;

export const ReportedDepositPaginationModel = z.object({
  data: z.array(ReportedDepositModel),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  totalPages: z.number().optional(),
});
export type ReportedDepositPaginationModel = z.infer<
  typeof ReportedDepositPaginationModel
>;
