import { MoreHorizontal, Shield, User } from 'lucide-react';
import { Permission } from '../../../models/permissions';

interface UserData {
  id: string;
  email: string;
  permissions: Permission[];
  loginCount: number;
  lastLogin: { seconds: number; nanoseconds: number };
  createdAt: { seconds: number; nanoseconds: number };
  hasPassword?: boolean;
}

interface UserMobileCardProps {
  user: UserData;
  canEditPermissions: boolean;
  onEditPermissions: (user: UserData) => void;
  getPermissionLabel: (permission: Permission) => string;
}

export function UserMobileCard({
  user,
  canEditPermissions,
  onEditPermissions,
  getPermissionLabel,
}: UserMobileCardProps) {
  // Formatação de datas
  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-gray-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-medium text-sm text-gray-900 break-all">
            {user.email}
          </h3>
          <p className="text-xs text-gray-500">
            ID: {user.id.substring(0, 8)}...
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 mb-3">
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="text-xs text-gray-500 w-full mb-1">Permissões:</span>
          <div className="flex flex-wrap gap-1">
            {(user.permissions || []).slice(0, 3).map((permission, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                title={getPermissionLabel(permission)}
              >
                {permission.split('_')[0]}
              </span>
            ))}
            {(user.permissions || []).length > 3 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                +{(user.permissions || []).length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mt-3">
          <div>
            <p className="text-xs font-medium">Acessos</p>
            <p className="text-gray-900">{user.loginCount || 0}</p>
          </div>
          <div>
            <p className="text-xs font-medium">Último Login</p>
            <p className="text-gray-900 text-xs">
              {formatDate(user.lastLogin)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-medium">Registro</p>
            <p className="text-gray-900 text-xs">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
        {canEditPermissions && (
          <button
            onClick={() => onEditPermissions(user)}
            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-md transition-colors flex items-center"
            title="Alterar permissões"
          >
            <Shield className="h-4 w-4 mr-1" />
            <span className="text-xs">Permissões</span>
          </button>
        )}
        <button
          className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-md transition-colors"
          title="Mais ações"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
