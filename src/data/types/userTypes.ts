export interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  providerId?: string;
  isActive: boolean;
  level: number;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilter {
  username?: string;
  status?: 'all' | 'active' | 'inactive';
  level?: number;
}
