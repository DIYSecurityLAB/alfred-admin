/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { Edit, Eye, MoreVertical, Unlock } from 'lucide-react';
import { useState } from 'react';

interface BlockedUserTableProps {
  blockedUsers: any[];
  onViewDetails: (blockedUser: any) => void;
  onEdit: (blockedUser: any) => void;
  onUnblock: (id: string) => void;
}

export function BlockedUserTable({
  blockedUsers,
  onViewDetails,
  onEdit,
  onUnblock,
}: BlockedUserTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Usuário
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              ID/Documento
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Razão
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Bloqueado em
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Bloqueado por
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
            >
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-3">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {user.username || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  {user.userId && (
                    <div className="text-gray-600 mb-1">
                      <span className="font-medium">ID:</span> {user.userId}
                    </div>
                  )}
                  {user.documentId && (
                    <div className="text-gray-600">
                      <span className="font-medium">Doc:</span>{' '}
                      {user.documentId}
                    </div>
                  )}
                  {!user.userId && !user.documentId && 'N/A'}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-sm inline-block">
                  {user.reason}
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm">
                {formatDate(user.createdAt)}
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm">
                {user.blockedBy}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center">
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
                            onViewDetails(user);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm flex items-center hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2 text-gray-500" />
                          Ver detalhes
                        </button>
                        <button
                          onClick={() => {
                            onEdit(user);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm flex items-center hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-2 text-gray-500" />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            onUnblock(user.id);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm flex items-center hover:bg-gray-50 text-red-600 transition-colors"
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Desbloquear
                        </button>
                      </motion.div>
                    )}
                  </div>
                  <div className="hidden sm:flex gap-1 ml-2">
                    <motion.button
                      onClick={() => onViewDetails(user)}
                      className="p-1.5 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => onEdit(user)}
                      className="p-1.5 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => onUnblock(user.id)}
                      className="p-1.5 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Unlock className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
