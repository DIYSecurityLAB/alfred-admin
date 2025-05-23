import {
  ListAllBlockedUserModel,
  ListedUserModel,
} from '@/data/model/user/user.model';
import { z } from 'zod';
import { SwapPegTransaction } from './report.entity';

export const BlockUser = z
  .object({
    userId: z.string().optional(),
    documentId: z.string().optional(),
    username: z.string().optional(),
    reason: z.string().nullable(),
  })
  .refine((data) => {
    if (!data.documentId && !data.userId && !data.username) {
      return false;
    }

    return true;
  });
export type BlockUser = z.infer<typeof BlockUser>;

export type CryptoType = 'BITCOIN' | 'USDT' | 'DEPIX';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'canceled'
  | 'review'
  | 'expired'
  | 'refunded'
  | 'complete';

export type DocumentType =
  | 'CPF'
  | 'CNPJ'
  | 'SSN'
  | 'PASSPORT'
  | 'DRIVERS_LICENSE'
  | 'NATIONAL_ID'
  | 'OTHER';

export class ListAllBlockedUser {
  id!: string;
  userId!: string | undefined | null;
  reason!: string | null;
  createdAt!: string;
  updatedAt!: string;
  user!: {
    id: string;
    username: string;
    depositos: Deposit[];
    documents: {
      id: string;
      countryCode: string;
      documentNumber: string;
      documentType: DocumentType;
    }[];
  };

  public static fromModel(model: ListAllBlockedUserModel): ListAllBlockedUser {
    const entity = new ListAllBlockedUser();

    entity.id = model.id;
    entity.userId = model.userId;
    entity.reason = model.reason;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;

    if (model.user) {
      entity.user = {
        id: model.user.id,
        username: model.user.username,
        depositos: model.user.depositos.map((dep) => {
          const deposit = new Deposit();

          deposit.id = dep.id;
          deposit.transactionId = dep.transactionId;
          deposit.phone = dep.phone ?? '';
          deposit.coldWallet = dep.coldWallet;
          deposit.network = dep.network;
          deposit.paymentMethod = dep.paymentMethod;
          deposit.transactionDate = dep.transactionDate;
          deposit.cupom = dep.cupom ?? null;
          deposit.valueBRL = dep.amount;
          deposit.assetValue = dep.cryptoValue ?? 0;
          deposit.cryptoType = dep.cryptoType;
          deposit.status = dep.status;
          deposit.username = dep.username;
          deposit.userId = dep.userId;

          deposit.SwapPegTransaction = (dep.SwapPegTransaction ?? []).flatMap(
            (peg) =>
              peg
                ? [
                    {
                      id: peg.id,
                      pegId: peg.pegId,
                      LiquidTxId: peg.LiquidTxId,
                      MempoolTxId: peg.MempoolTxId,
                    },
                  ]
                : [],
          );
          return deposit;
        }),
        documents: model.user.documents,
      };
    }

    return entity;
  }
}

export class UserDocument {
  id!: string;
  userId!: string;
  countryCode!: string;
  documentType!: DocumentType;
  documentNumber!: string;
  expirationDate!: string | null;
  isVerified!: boolean;
  createdAt!: string;
  updatedAt!: string;
}

export class Deposit {
  id!: string;
  transactionId!: string;
  phone?: string | null;
  coldWallet!: string;
  network!: string;
  paymentMethod!: string;
  transactionDate!: string;
  cupom!: string | null;
  valueBRL!: number;
  assetValue?: number;
  cryptoType!: CryptoType;
  status!: PaymentStatus;
  username!: string;
  userId!: string;
  SwapPegTransaction!: SwapPegTransaction[];
}

export class ListedUser {
  id!: string;
  providerId!: string;
  isActive!: boolean;
  username!: string | null;
  level!: number;
  createdAt!: string;
  updatedAt!: string;
  documents!: UserDocument[];
  deposits!: Deposit[];

  public static fromModel(model: ListedUserModel): ListedUser {
    const entity = new ListedUser();

    entity.id = model.id;
    entity.providerId = model.providerId ?? '';
    entity.isActive = model.isActive;
    entity.username = model.username;
    entity.level = model.level;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    entity.documents = model.documents;
    entity.documents = model.documents.map((doc) => {
      return {
        id: doc.id,
        userId: doc.userId,
        countryCode: doc.countryCode,
        documentType: doc.documentType,
        documentNumber: doc.documentNumber,
        expirationDate: doc.expirationDate,
        isVerified: doc.isVerified,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
    });

    entity.deposits = model.depositos.map((dep) => {
      const deposit = new Deposit();

      deposit.id = dep.id;
      deposit.transactionId = dep.transactionId;
      deposit.phone = dep.phone ?? '';
      deposit.coldWallet = dep.coldWallet;
      deposit.network = dep.network;
      deposit.paymentMethod = dep.paymentMethod;
      deposit.transactionDate = dep.transactionDate;
      deposit.cupom = dep.cupom ?? null;
      deposit.valueBRL = dep.amount;
      deposit.assetValue = dep.cryptoValue ?? 0;
      deposit.cryptoType = dep.cryptoType;
      deposit.status = dep.status;
      deposit.username = dep.username;
      deposit.userId = dep.userId;

      deposit.SwapPegTransaction = (dep.SwapPegTransaction ?? []).flatMap(
        (peg) =>
          peg
            ? [
                {
                  id: peg.id,
                  pegId: peg.pegId,
                  LiquidTxId: peg.LiquidTxId,
                  MempoolTxId: peg.MempoolTxId,
                },
              ]
            : [],
      );
      return deposit;
    });

    return entity;
  }
}

export class ListAllUser {
  data!: ListedUser[];
  page!: number;
  itemsPerPage!: number;
  totalPages!: number;
}
