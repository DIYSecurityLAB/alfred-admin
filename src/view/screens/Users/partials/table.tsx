import { ListedUser } from '@/domain/entities/User';
import { motion } from 'framer-motion';
import { Calendar, Eye } from 'lucide-react';

type UserTableProps = {
  users: ListedUser[];
  onViewDetails: (user: ListedUser) => void;
  canViewDetails?: boolean;
  canEditUsers?: boolean;
};

const getLevelName = (level: number): string => {
  switch (level) {
    case 0:
      return 'Madeira';
    case 1:
      return 'Bronze';
    case 2:
      return 'Prata';
    case 3:
      return 'Ouro';
    case 4:
      return 'Platina';
    case 5:
      return 'Diamante';
    default:
      return `Nível ${level}`;
  }
};

export function UserTable({
  users,
  onViewDetails,
  canViewDetails = true,
  canEditUsers = false,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Usuário
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Nível
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Data de Criação
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Documentos
            </th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {users.map((user) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-3">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : 'U'}
                  </div>
                  <div className="font-medium text-gray-800">
                    {user.username || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium inline-flex items-center
                    ${
                      user.level >= 4
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : user.level >= 3
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : user.level >= 2
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                >
                  {getLevelName(user.level)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium inline-flex items-center ${
                    user.isActive
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{user.createdAt}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-600">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {user.documents.length}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-1">
                  {canViewDetails && (
                    <motion.button
                      onClick={() => onViewDetails(user)}
                      className={`p-1.5 rounded-full transition-colors ${
                        // Sempre permitir visualização, mas com estilos diferentes
                        canEditUsers
                          ? 'hover:bg-blue-50 text-blue-500'
                          : 'hover:bg-gray-50 text-blue-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Ver detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
