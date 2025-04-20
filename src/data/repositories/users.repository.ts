import { DefaultResultError, ResultOld } from '../../utils/ResultOld';
import { remoteDataSourceOld } from '../datasource/RemoteOld.datasource';
import { z } from 'zod';

export const UserModel = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().optional(),
  name: z.string().optional(),
  providerId: z.string().optional(),
  isActive: z.boolean(),
  level: z.number(),
  refreshToken: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type UserModel = z.infer<typeof UserModel>;

export const UsersListModel = z.object({
  users: z.array(UserModel),
  total: z.number()
});
export type UsersListModel = z.infer<typeof UsersListModel>;

export const UserFilterModel = z.object({
  username: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).optional(),
  level: z.number().optional()
});
export type UserFilterModel = z.infer<typeof UserFilterModel>;

export type GetUsersReq = {
  page: number;
  limit: number;
  filters?: UserFilterModel;
};
export type GetUsersRes = Promise<
  ResultOld<UsersListModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type GetUserReq = {
  id: string;
};
export type GetUserRes = Promise<
  ResultOld<UserModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type UpdateUserStatusReq = {
  id: string;
  isActive: boolean;
};
export type UpdateUserStatusRes = Promise<
  ResultOld<UserModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export type UpdateUserLevelReq = {
  id: string;
  level: number;
};
export type UpdateUserLevelRes = Promise<
  ResultOld<UserModel, { code: 'SERIALIZATION' } | DefaultResultError>
>;

export interface UsersRepository {
  getUsers(req: GetUsersReq): GetUsersRes;
  getUserById(req: GetUserReq): GetUserRes;
  updateUserStatus(req: UpdateUserStatusReq): UpdateUserStatusRes;
  updateUserLevel(req: UpdateUserLevelReq): UpdateUserLevelRes;
}

export class UsersRepositoryImpl implements UsersRepository {
  constructor(private api = remoteDataSourceOld) {}

  async getUsers({ page, limit, filters }: GetUsersReq): GetUsersRes {
    try {
      let url = `/users?page=${page}&limit=${limit}`;
      
      if (filters) {
        if (filters.username) url += `&username=${filters.username}`;
        if (filters.status && filters.status !== 'all') url += `&isActive=${filters.status === 'active'}`;
        if (filters.level !== undefined) url += `&level=${filters.level}`;
      }
      
      const result = await this.api.get({
        url,
        model: UsersListModel,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error getting users:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async getUserById({ id }: GetUserReq): GetUserRes {
    try {
      const result = await this.api.get({
        url: `/users/${id}`,
        model: UserModel,
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async updateUserStatus({ id, isActive }: UpdateUserStatusReq): UpdateUserStatusRes {
    try {
      const result = await this.api.patch({
        url: `/users/${id}`,
        model: UserModel,
        body: { isActive },
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error updating user status:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }

  async updateUserLevel({ id, level }: UpdateUserLevelReq): UpdateUserLevelRes {
    try {
      const result = await this.api.patch({
        url: `/users/${id}/level`,
        model: UserModel,
        body: { level },
      });

      if (!result) {
        return ResultOld.Error({ code: 'SERIALIZATION' });
      }

      return ResultOld.Success(result);
    } catch (error) {
      console.error('Error updating user level:', error);
      return ResultOld.Error({ code: 'UNKNOWN_ERROR' });
    }
  }
}

// Singleton instance
export const usersRepository = new UsersRepositoryImpl();