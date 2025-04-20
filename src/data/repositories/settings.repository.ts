import { DefaultResultError, ResultOld } from '../../utils/ResultOld';
import { remoteDataSource } from '../datasource/Remote.datasource';
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

export type GetSettingsRes = Promise<
  ResultOld<SettingsModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type UpdateSettingsReq = Partial<SettingsModel>;
export type UpdateSettingsRes = Promise<
  ResultOld<SettingsModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export interface SettingsRepository {
  getSettings(): GetSettingsRes;
  updateSettings(settings: UpdateSettingsReq): UpdateSettingsRes;
}

export class SettingsRepositoryImpl implements SettingsRepository {
  constructor(private api = remoteDataSource) {}

  async getSettings(): GetSettingsRes {
    try {
      const result = await this.api.get({
        url: '/settings',
        model: SettingsModel,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error getting settings:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async updateSettings(settings: UpdateSettingsReq): UpdateSettingsRes {
    try {
      const result = await this.api.patch({
        url: '/settings',
        model: SettingsModel,
        body: settings,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error updating settings:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

export const settingsRepository = new SettingsRepositoryImpl();