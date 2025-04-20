import { z } from 'zod';

export const ConfigModel = z.object({
  id: z.number(),
  isSwapPegActive: z.boolean(),
  isMaintenanceMode: z.boolean(),
  feeWithoutCouponBelowValue: z.number(),
  feeWithoutCouponAboveValue: z.number(),
  feeWithCouponAboveValue: z.number(),
  feeValue: z.number(),
});
export type ConfigModel = z.infer<typeof ConfigModel>;
