import { z } from 'zod';

// Modelo para inserção de cupom com campos requeridos e opcionais adequados
export const InsertCouponModel = z.object({
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),  // Alterado para discountType
  discountValue: z.number(),
  minPurchaseValue: z.number().optional().default(0),
  maxDiscountValue: z.number().optional().default(0),
  usageLimit: z.number().optional().default(100),
  usedCount: z.number().default(0),
  isActive: z.boolean().default(true),
  validFrom: z.string(),
  validUntil: z.string().nullable().optional(),
});
export type InsertCouponModel = z.infer<typeof InsertCouponModel>;

export const InsertedCouponModel = z.object({
  id: z.string().min(1),
});
export type InsertedCouponModel = z.infer<typeof InsertedCouponModel>;

export const ListCouponsModel = z.object({
  id: z.string().min(1),
});
export type ListCouponsModel = z.infer<typeof ListCouponsModel>;

// Atualizado para corresponder à estrutura real da API
export const ListedCouponModel = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),  // Alterado para discountType
  discountValue: z.number(),
  validFrom: z.string(),
  validUntil: z.string().nullable().optional(),
  // Campos opcionais que podem não vir da API
  minPurchaseValue: z.number().optional().default(0),
  maxDiscountValue: z.number().optional().default(0),
  usageLimit: z.number().optional().default(100),
  usedCount: z.number().default(0),
  isActive: z.boolean().default(true),
});
export type ListedCouponModel = z.infer<typeof ListedCouponModel>;

export const ListedAllCouponsModel = z.object({
  data: z.array(ListedCouponModel),
  page: z.number().nullable().optional(),
  limit: z.number().nullable().optional(),
  totalPages: z.number().nullable().optional(),
});
export type ListedAllCouponsModel = z.infer<typeof ListedAllCouponsModel>;

export const ToggleCouponStatusModel = z.object({
  id: z.string().min(1),
});
export type ToggleCouponStatusModel = z.infer<typeof ToggleCouponStatusModel>;

export const ToggledCouponStatusModel = z.object({
  code: z.string().min(1),
  isActive: z.boolean(),
});
export type ToggledCouponStatusModel = z.infer<typeof ToggledCouponStatusModel>;

export const FilterCouponsModel = z.object({
  code: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).optional(),
  sort: z.enum(['none', 'most-used', 'least-used', 'newest', 'oldest']).optional(),
});
export type FilterCouponsModel = z.infer<typeof FilterCouponsModel>;

// Adicionando modelos para validação de cupons
export const ValidateCouponModel = z.object({
  code: z.string().min(1),
});
export type ValidateCouponModel = z.infer<typeof ValidateCouponModel>;

export const ValidateCouponResultModel = z.object({
  isValid: z.boolean(),
  message: z.string(),
  coupon: ListedCouponModel.optional(),
});
export type ValidateCouponResultModel = z.infer<typeof ValidateCouponResultModel>;
