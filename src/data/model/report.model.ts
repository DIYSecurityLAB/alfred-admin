import { z } from 'zod';
import { CryptoTypeModel, PaymentStatusModel } from './user/user.model';

export const ReportedDepositModel = z.object({
  id: z.string().min(1),
  transactionId: z.string().min(1),
  phone: z.string(),
  coldWallet: z.string(),
  network: z.string(),
  paymentMethod: z.string(),
  transactionDate: z.string(),
  cupom: z.string().optional().nullable(),
  valueBRL: z.number(),
  assetValue: z.number(),
  status: PaymentStatusModel,
  cryptoType: CryptoTypeModel,
  username: z.string(),
  discountType: z.string().optional(),
  discountValue: z.number().optional(),
  valueCollected: z.number().optional(),
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
