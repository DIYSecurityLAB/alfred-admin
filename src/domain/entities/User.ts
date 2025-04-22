import { ListAllBlockedUserModel } from '@/data/model/user/user.model';
import { z } from 'zod';

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

export type CryptoType = 'BTC' | 'USDT' | 'DEPIX';

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
  createdAt!: Date;
  updatedAt!: Date;
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
      createdAt: Date;
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
