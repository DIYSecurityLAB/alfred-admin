import { ListAllBlockedUser } from '@/domain/entities/User';
import { ROUTES } from '@/view/routes/Routes';
import { motion } from 'framer-motion';
import { Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type BlockedUserTableProps = {
  blockedUsers: ListAllBlockedUser[];
  canViewDetails?: boolean;
};

export function BlockedUserTable({
  blockedUsers,
  canViewDetails = true,
}: BlockedUserTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="overflow-x-hidden">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              ID
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Usuário
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              User ID
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Razão
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Bloqueado em
            </th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {blockedUsers.map((user) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.01, x: 5 }}
            >
              <td className="py-3 px-4 text-gray-600 text-sm">{user.id}</td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-3">
                    {user.user.username
                      ? user.user.username.charAt(0).toUpperCase()
                      : 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {user.user.username || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm">{user.userId}</td>
              <td className="py-3 px-4">
                {user.reason ? (
                  <div className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-sm inline-block">
                    {user.reason}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">
                    Não especificado
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm">
                {user.createdAt}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center">
                  {canViewDetails ? (
                    <>
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(user.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>
                        {activeMenu === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 w-40"
                          >
                            <button
                              onClick={() => {
                                setActiveMenu(null);
                                navigate(
                                  ROUTES.users.blocked.details.call(
                                    user.userId ?? '',
                                  ),
                                );
                              }}
                              className="w-full px-4 py-2 text-left text-sm flex items-center hover:bg-gray-50 transition-colors"
                            >
                              <Eye className="h-4 w-4 mr-2 text-gray-500" />
                              Ver detalhes
                            </button>
                          </motion.div>
                        )}
                      </div>
                      <div className="hidden sm:flex gap-1 ml-2">
                        <motion.button
                          onClick={() => {
                            navigate(
                              ROUTES.users.blocked.details.call(
                                user.userId ?? '',
                              ),
                            );
                          }}
                          className="p-1.5 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Acesso restrito
                    </span>
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
