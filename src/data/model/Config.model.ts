import { z } from 'zod';

export const ConfigModel = z.object({
  id: z.number(),
  isSwapPegActive: z.boolean(),
  isMaintenanceMode: z.boolean()
});

export type ConfigModel = z.infer<typeof ConfigModel>;
