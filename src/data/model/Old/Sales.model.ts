import { z } from 'zod';

export const SaleStatusEnum = z.enum(['pending', 'completed', 'cancelled']);
export type SaleStatusEnum = z.infer<typeof SaleStatusEnum>;

export const SaleItemModel = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});
export type SaleItemModel = z.infer<typeof SaleItemModel>;

export const SaleModel = z.object({
  id: z.string(),
  userId: z.string(),
  total: z.number(),
  status: SaleStatusEnum,
  paymentMethod: z.string(),
  createdAt: z.string(),
  items: z.array(SaleItemModel),
});
export type SaleModel = z.infer<typeof SaleModel>;

export const SalesListModel = z.object({
  sales: z.array(SaleModel),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type SalesListModel = z.infer<typeof SalesListModel>;

export const UpdateSaleStatusModel = z.object({
  id: z.string(),
  status: SaleStatusEnum,
});
export type UpdateSaleStatusModel = z.infer<typeof UpdateSaleStatusModel>;
