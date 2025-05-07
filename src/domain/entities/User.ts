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
  userId!: string;
  reason!: string | null;
  createdAt!: string;
  updatedAt!: string;
  user!: {
    id: string;
    username: string;
    depositos: {
      id: string;
      transactionId: string;
      valorBRL: number;
      cupom?: string | null;
      cryptoType: CryptoType | null;
      status: PaymentStatus;
      createdAt: string;
    }[];
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
        depositos: model.user.depositos,
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
  phone!: string;
  coldWallet!: string;
  network!: string;
  paymentMethod!: string;
  transactionDate!: string;
  cupom!: string | null;
  valueBRL!: number;
  assetValue!: number;
  cryptoType!: CryptoType;
  status!: PaymentStatus;
  username!: string;
  userId!: string;
  swapPegTransaction!: SwapPegTransaction;
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
    entity.providerId = model.providerId;
    entity.isActive = model.isActive;
    entity.username = model.username;
    entity.level = model.level;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    entity.documents = model.documents;
    entity.deposits = model.depositos;

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
      return {
        id: dep.id,
        transactionId: dep.transactionId,
        phone: dep.phone,
        coldWallet: dep.coldWallet,
        network: dep.network,
        paymentMethod: dep.paymentMethod,
        transactionDate: dep.transactionDate,
        cupom: dep.cupom,
        valueBRL: dep.valueBRL,
        assetValue: dep.assetValue,
        cryptoType: dep.cryptoType,
        status: dep.status,
        username: dep.username,
        userId: dep.userId,
        swapPegTransaction: dep.swapPegTransaction,
      };
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
