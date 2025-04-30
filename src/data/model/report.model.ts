import { z } from 'zod';
import { CryptoTypeModel, PaymentStatusModel } from './user/user.model';

export const ReportedDepositModel = z.object({
  id: z.string().min(1),
  transactionId: z.string().min(1),
  phone: z.string().optional().nullable(),
  coldWallet: z.string(),
  network: z.string(),
  paymentMethod: z.string(),
  transactionDate: z.string(),
  cupom: z.string().optional().nullable(),
  valueBRL: z.number().optional(),
  assetValue: z.number().optional(),
  status: PaymentStatusModel,
  cryptoType: CryptoTypeModel.nullable().optional(),
  username: z.string().optional().nullable(),
  discountType: z.string().optional().nullable(),
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
