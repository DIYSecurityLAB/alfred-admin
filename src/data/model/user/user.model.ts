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
