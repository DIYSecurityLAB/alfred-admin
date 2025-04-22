import { ListAllBlockedUser } from '@/domain/entities/User';
import { motion } from 'framer-motion';
import { Calendar, Eye, Shield, User } from 'lucide-react';

interface BlockedUserCardsProps {
  blockedUsers: ListAllBlockedUser[];
}

export function BlockedUserCards({ blockedUsers }: BlockedUserCardsProps) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {blockedUsers.map((user) => (
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
                  {user.user.username
                    ? user.user.username.charAt(0).toUpperCase()
                    : 'U'}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {user.user.username || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {user.userId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Razão do bloqueio
                  </p>
                  <p className="text-sm text-gray-800">
                    {user.reason || 'Não especificado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(user.createdAt)}</span>
              </div>

              {user.user.documents && user.user.documents.length > 0 && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Documento
                    </p>
                    <p className="text-sm text-gray-800">
                      {user.user.documents[0].documentType}:{' '}
                      {user.user.documents[0].documentNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 p-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Ver detalhes</span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
