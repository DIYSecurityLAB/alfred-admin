import {
  ReportedDepositModel,
  ReportedDepositPaginationModel,
} from '@/data/model/report.model';
import { z } from 'zod';

export class ReportedDepositPagination {
  data!: ReportedDeposit[];
  pageSize!: number;
  totalPages?: number;

  public static fromModel(
    model: ReportedDepositPaginationModel,
  ): ReportedDepositPagination {
    const entity = new ReportedDepositPagination();

    entity.data = model.data.map((item) => ReportedDeposit.fromModel(item));

    entity.pageSize = model.pageSize ?? 0;

    entity.totalPages = model.totalPages;

    return entity;
  }
}

export const PaymentStatus = z.union([
  z.literal('pending'),
  z.literal('paid'),
  z.literal('canceled'),
  z.literal('review'),
  z.literal('expired'),
  z.literal('refunded'),
  z.literal('complete'),
]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const CryptoType = z.union([
  z.literal('BITCOIN'),
  z.literal('USDT'),
  z.literal('DEPIX'),
]);
export type CryptoType = z.infer<typeof CryptoType>;

export class ReportedDeposit {
  id!: string;
  transactionId!: string;
  phone!: string;
  coldWallet!: string;
  network!: string;
  paymentMethod!: string;
  transactionDate!: string;
  coupon!: string | undefined;
  valueBRL!: number;
  assetValue!: number;
  status!: PaymentStatus;
  cryptoType!: CryptoType;
  username!: string;
  discountType!: string;
  discountValue!: number;
  valueCollected!: number;

  public static fromModel(model: ReportedDepositModel): ReportedDeposit {
    const entity = new ReportedDeposit();

    entity.id = model.id;

    entity.transactionId = model.transactionId;

    entity.phone = model.phone;

    entity.coldWallet = model.coldWallet;

    entity.network = model.network;

    entity.paymentMethod = model.paymentMethod;

    entity.transactionDate = model.transactionDate;

    if (model.cupom) {
      entity.coupon = model.cupom;
    }

    entity.cryptoType = model.cryptoType;

    entity.valueBRL = model.valueBRL;

    entity.assetValue = model.assetValue;

    entity.status = model.status;

    entity.username = model.username;

    entity.discountType = model.discountType ?? 'percentege';

    entity.discountValue = model.discountValue ?? 0;

    entity.valueCollected = model.valueCollected ?? 0;

    return entity;
  }
}
