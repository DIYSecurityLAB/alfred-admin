import { ListedUser } from '@/domain/entities/User';
import { motion } from 'framer-motion';
import { Calendar, Eye } from 'lucide-react';

interface UserCardsProps {
  users: ListedUser[];
  onViewDetails: (user: ListedUser) => void;
  canViewDetails?: boolean;
  canEditUsers?: boolean;
}

export function UserCards({
  users,
  onViewDetails,
  canViewDetails = true,
  canEditUsers = false,
}: UserCardsProps) {
  const getLevelName = (level: number): string => {
    switch (level) {
      case 1:
        return 'Básico';
      case 2:
        return 'Intermediário';
      case 3:
        return 'Avançado';
      case 4:
        return 'Premium';
      default:
        return `Nível ${level}`;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-3">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {user.username || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {user.id.substring(0, 10)}...
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.isActive
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {user.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-sm text-gray-500">Nível:</p>
                <p
                  className={`font-medium 
                  ${
                    user.level >= 4
                      ? 'text-purple-600'
                      : user.level >= 3
                        ? 'text-blue-600'
                        : user.level >= 2
                          ? 'text-green-600'
                          : 'text-gray-700'
                  }`}
                >
                  {getLevelName(user.level)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Documentos:</p>
                <p className="font-medium">{user.documents.length}</p>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Criado em {user.createdAt}</span>
            </div>

            {user.deposits.length > 0 && (
              <div className="px-3 py-2 bg-blue-50 rounded-md text-sm text-blue-700 flex justify-between items-center">
                <span>Depósitos: {user.deposits.length}</span>
              </div>
            )}
          </div>

          {canViewDetails && (
            <div className="border-t border-gray-100 p-4 flex justify-end items-center gap-1">
              <button
                onClick={() => onViewDetails(user)}
                className={`p-2 rounded-lg transition-colors ${
                  // Permitir sempre ver detalhes, mas destacar visualmente diferenças
                  // entre apenas visualizar e poder editar
                  canEditUsers
                    ? 'hover:bg-blue-50 text-blue-500'
                    : 'hover:bg-gray-50 text-blue-600'
                }`}
                title="Ver detalhes"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
