import { DefaultResultError, ResultOld } from '../../utils/ResultOld';
import { remoteDataSourceOld } from '../datasource/RemoteOld.datasource';
import { DashboardStatsModel } from '../model/Old/Dashboard.model';

export type GetDashboardStatsRes = Promise<
  ResultOld<DashboardStatsModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export interface DashboardRepository {
  getDashboardStats(): GetDashboardStatsRes;
}

export class DashboardRepositoryImpl implements DashboardRepository {
  constructor(private api = remoteDataSourceOld) {}

  async getDashboardStats(): GetDashboardStatsRes {
    try {
      const result = await this.api.get({
        url: '/dashboard/stats',
        model: DashboardStatsModel,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

export const dashboardRepository = new DashboardRepositoryImpl();
