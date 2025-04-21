import { motion } from 'framer-motion';
import {
  Calendar,
  Edit,
  Eye,
  FileText,
  Shield,
  Unlock,
  User,
} from 'lucide-react';
import { BlockedUserData } from '../useBlockedUser';

interface BlockedUserCardsProps {
  blockedUsers: BlockedUserData[];
  onViewDetails: (blockedUser: BlockedUserData) => void;
  onEdit: (blockedUser: BlockedUserData) => void;
  onUnblock: (id: string) => void;
}

export function BlockedUserCards({
  blockedUsers,
  onViewDetails,
  onEdit,
  onUnblock,
}: BlockedUserCardsProps) {
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
    <div className="grid grid-cols-1 gap-4">
      {blockedUsers.map((user) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-3">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">
                  {user.username || 'Usuário sem nome'}
                </h3>
                <div className="text-sm text-gray-500">
                  Bloqueado por: {user.blockedBy}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-sm inline-block">
                {user.reason}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-4">
              {user.userId && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">ID:</span> {user.userId}
                </div>
              )}
              {user.documentId && (
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Doc:</span>{' '}
                  {user.documentId}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Bloqueado em:</span>{' '}
                {formatDate(user.createdAt)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Bloqueado por:</span>{' '}
                {user.blockedBy}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <motion.button
                onClick={() => onViewDetails(user)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-sm flex items-center gap-1.5 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="h-4 w-4" />
                Detalhes
              </motion.button>
              <motion.button
                onClick={() => onEdit(user)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-sm flex items-center gap-1.5 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit className="h-4 w-4" />
                Editar
              </motion.button>
              <motion.button
                onClick={() => onUnblock(user.id)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm flex items-center gap-1.5 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Unlock className="h-4 w-4" />
                Desbloquear
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
