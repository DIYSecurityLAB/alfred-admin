import { motion } from 'framer-motion';
import { Lock, ShieldAlert, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Permission, getPermissionName } from '../../models/permissions';

interface LockedFeatureMessageProps {
  requiredPermissions?: Permission | Permission[];
  showBackButton?: boolean;
}

export function LockedFeatureMessage({
  requiredPermissions,
  showBackButton = false,
}: LockedFeatureMessageProps) {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const getMessage = () => {
    if (requiredPermissions) {
      const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions.map((p) => getPermissionName(p)).join(', ')
        : getPermissionName(requiredPermissions);

      return `Esta funcionalidade requer as seguintes permissões: ${permissions}`;
    }

    return 'Esta funcionalidade requer permissões que você não possui';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-100 p-3 rounded-full mb-4 relative">
            <Lock className="h-8 w-8 text-yellow-600" />
            <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1">
              <ShieldAlert className="h-4 w-4 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acesso Restrito
          </h2>

          <p className="text-gray-600 mb-6">{getMessage()}</p>

          <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Suas permissões</p>
                  <p className="font-medium text-gray-700 max-h-20 overflow-y-auto text-xs">
                    {userData?.permissions
                      ? userData.permissions
                          .map((p) => getPermissionName(p))
                          .join(', ')
                      : 'Sem permissões'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            Para obter acesso, entre em contato com um administrador do sistema
            para solicitar uma elevação do seu nível de permissão.
          </div>

          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
            >
              Voltar
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
