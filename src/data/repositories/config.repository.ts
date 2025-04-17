import { DefaultResultError, Result } from '../../utils/Result';
import { remoteDataSource } from '../datasource/Remote.datasource';
import { ConfigModel } from '../model/Config.model';

export type ReadConfigRes = Promise<
  Result<ConfigModel, { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError>
>;

export type UpdateConfigReq = {
  isSwapPegActive?: boolean;
  isMaintenanceMode?: boolean;
};
export type UpdateConfigRes = Promise<
  Result<ConfigModel, { code: 'SERIALIZATION' | 'NOT_FOUND' } | DefaultResultError>
>;

export interface ConfigRepository {
  getConfig(): ReadConfigRes;
  updateConfig(config: UpdateConfigReq): UpdateConfigRes;
}

export class ConfigRepositoryImpl implements ConfigRepository {
  constructor(private api = remoteDataSource) {}

  async getConfig(): ReadConfigRes {
    try {
      const result = await this.api.get({
        url: '/config',
        model: ConfigModel,
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      return Result.Success(result);
    } catch (error) {
      console.error('Error getting config:', error);
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async updateConfig(config: UpdateConfigReq): UpdateConfigRes {
    try {
      const result = await this.api.patch({
        url: '/config',
        model: ConfigModel,
        body: config,
      });

      if (!result) {
        return Result.Error({ code: 'SERIALIZATION' });
      }

      return Result.Success(result);
    } catch (error) {
      console.error('Error updating config:', error);
      return Result.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

export const configRepository = new ConfigRepositoryImpl();
