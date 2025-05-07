import { z } from 'zod';

export const CryptoTypeModel = z.union([
  z.literal('BITCOIN'),
  z.literal('USDT'),
  z.literal('DEPIX'),
]);
export type CryptoTypeModel = z.infer<typeof CryptoTypeModel>;

export const PaymentStatusModel = z.union([
  z.literal('pending'),
  z.literal('paid'),
  z.literal('canceled'),
  z.literal('review'),
  z.literal('expired'),
  z.literal('refunded'),
  z.literal('complete'),
]);
export type PaymentStatusModel = z.infer<typeof PaymentStatusModel>;

export const DocumentTypeModel = z.union([
  z.literal('CPF'),
  z.literal('CNPJ'),
  z.literal('SSN'),
  z.literal('PASSPORT'),
  z.literal('DRIVERS_LICENSE'),
  z.literal('NATIONAL_ID'),
  z.literal('OTHER'),
]);
export type DocumentTypeModel = z.infer<typeof DocumentTypeModel>;

export const ListAllBlockedUserModel = z.object({
  id: z.string(),
  userId: z.string(),
  reason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    depositos: z.array(
      z.object({
        id: z.string(),
        transactionId: z.string(),
        valorBRL: z.number(),
        cupom: z.string().nullable().optional(),
        cryptoType: CryptoTypeModel.nullable(),
        status: PaymentStatusModel,
        createdAt: z.string(),
      }),
    ),
    documents: z.array(
      z.object({
        id: z.string(),
        countryCode: z.string(),
        documentNumber: z.string(),
        documentType: DocumentTypeModel,
      }),
    ),
  }),
});
export type ListAllBlockedUserModel = z.infer<typeof ListAllBlockedUserModel>;

export const ListedUserModel = z.object({
  id: z.string(),
  providerId: z.string().nullable(),
  isActive: z.boolean(),
  username: z.string().nullable(),
  level: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  documents: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      countryCode: z.string(),
      documentType: DocumentTypeModel,
      documentNumber: z.string(),
      expirationDate: z.string().nullable(),
      isVerified: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
  depositos: z.array(
    z.object({
      id: z.string(),
      transactionId: z.string(),
      phone: z.string().nullable().optional(),
      coldWallet: z.string(),
      network: z.string(),
      paymentMethod: z.string(),
      transactionDate: z.string(),
      cupom: z.string(),
      valueBRL: z.number(),
      assetValue: z.number().optional(),
      cryptoType: CryptoTypeModel,
      status: PaymentStatusModel,
      username: z.string(),
      userId: z.string(),
      swapPegTransaction: z
        .array(
          z
            .object({
              id: z.number(),
              pegId: z.string(),
              LiquidTxId: z.string(),
              MempoolTxId: z.string(),
            })
            .optional(),
        )
        .optional(),
    }),
  ),
});
export type ListedUserModel = z.infer<typeof ListedUserModel>;

export const ListAllUserModel = z.object({
  data: z.array(ListedUserModel),
  page: z.number(),
  itemsPerPage: z.number(),
  totalPages: z.number(),
});
export type ListAllUserModel = z.infer<typeof ListAllUserModel>;
