import { z } from 'zod';

export const SettingsModel = z.object({
  maintenanceMode: z.boolean(),
  enabledPaymentMethods: z.array(
    z.object({
      method: z.string(),
      enabled: z.boolean()
    })
  ),
  emailNotifications: z.boolean()
});
export type SettingsModel = z.infer<typeof SettingsModel>;
