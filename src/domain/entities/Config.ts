import { z } from "zod";

export const Config = z.object({
  isMaintenanceMode: z.boolean(),
  isSwapPegActive: z.boolean(),
  feeWithoutCouponBelowValue: z.number(),
  feeWithoutCouponAboveValue: z.number(),
  feeWithCouponAboveValue: z.number(),
  feeValue: z.number(),
});
export type Config = z.infer<typeof Config>;

export type UpdateConfig = Partial<Config>;