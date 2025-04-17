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
  data: z.array(UserModel),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
  totalPages: z.number().optional(),
});
export type UsersListModel = z.infer<typeof UsersListModel>;

export const UserFilterModel = z.object({
  username: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).optional(),
  level: z.number().optional()
});
export type UserFilterModel = z.infer<typeof UserFilterModel>;
