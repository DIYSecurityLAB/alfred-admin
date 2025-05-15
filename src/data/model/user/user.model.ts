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
  reason: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z
    .object({
      id: z.string(),
      username: z.string(),
      depositos: z.array(
        z
          .object({
            id: z.string(),
            transactionId: z.string(),
            phone: z.string().nullable().optional(),
            coldWallet: z.string().optional(),
            network: z.string().optional(),
            paymentMethod: z.string().optional(),
            transactionDate: z.string().optional(),
            cupom: z.string().nullable().optional(),
            amount: z.number().optional(),
            valorBRL: z
              .number()
              .optional()
              .nullable()
              .transform((val) => val ?? 0),
            cryptoValue: z.number().optional(),
            cryptoType: CryptoTypeModel.optional(),
            status: PaymentStatusModel.optional(),
            username: z.string().optional(),
            userId: z.string().optional(),
            SwapPegTransaction: z
              .array(
                z
                  .object({
                    id: z.number().optional(),
                    pegId: z.string().optional(),
                    LiquidTxId: z.string().optional(),
                    MempoolTxId: z.string().optional(),
                  })
                  .optional(),
              )
              .optional(),
          })
          .optional(),
      ),
      documents: z.array(
        z
          .object({
            id: z.string().optional(),
            countryCode: z.string().optional(),
            documentNumber: z.string().optional(),
            documentType: DocumentTypeModel.optional(),
          })
          .optional(),
      ),
    })
    .optional(),
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
      amount: z.number(),
      valorBRL: z
        .number()
        .optional()
        .nullable()
        .transform((val) => val ?? 0),
      cryptoValue: z.number().optional(),
      cryptoType: CryptoTypeModel,
      status: PaymentStatusModel,
      username: z.string(),
      userId: z.string(),
      SwapPegTransaction: z
        .array(
          z
            .object({
              id: z.number(),
              pegId: z
                .string()
                .optional()
                .nullable()
                .transform((val) => val ?? ''),
              LiquidTxId: z
                .string()
                .optional()
                .nullable()
                .transform((val) => val ?? ''),
              MempoolTxId: z
                .string()
                .optional()
                .nullable()
                .transform((val) => val ?? ''),
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
