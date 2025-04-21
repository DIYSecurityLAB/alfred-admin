import { motion } from 'framer-motion';
import { Calendar, Clock, Edit, FileText, Shield, User, X } from 'lucide-react';
import { BlockedUserData } from '../useBlockedUser';

interface BlockedUserDetailsModalProps {
  blockedUser: BlockedUserData;
  onClose: () => void;
  onEdit: () => void;
}

export function BlockedUserDetailsModal({
  blockedUser,
  onClose,
  onEdit,
}: BlockedUserDetailsModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Detalhes do Bloqueio
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-3 text-lg">
              {blockedUser.username
                ? blockedUser.username.charAt(0).toUpperCase()
                : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                {blockedUser.username || 'Usuário sem nome'}
              </h3>
              <div className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-sm inline-block mt-1">
                {blockedUser.reason}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-700 mb-3">
              Informações do Usuário
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {blockedUser.username && (
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Username</div>
                    <div className="font-medium">{blockedUser.username}</div>
                  </div>
                </div>
              )}
              {blockedUser.userId && (
                <div className="flex items-center text-gray-600">
                  <FileText className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">ID do Usuário</div>
                    <div className="font-medium break-all">
                      {blockedUser.userId}
                    </div>
                  </div>
                </div>
              )}
              {blockedUser.documentId && (
                <div className="flex items-center text-gray-600">
                  <FileText className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Documento</div>
                    <div className="font-medium">{blockedUser.documentId}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-700 mb-3">
              Detalhes do Bloqueio
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center text-gray-600">
                <Shield className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Bloqueado por</div>
                  <div className="font-medium">{blockedUser.blockedBy}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Data de bloqueio</div>
                  <div className="font-medium">
                    {formatDate(blockedUser.createdAt)}
                  </div>
                </div>
              </div>
              {blockedUser.updatedAt !== blockedUser.createdAt && (
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">
                      Última atualização
                    </div>
                    <div className="font-medium">
                      {formatDate(blockedUser.updatedAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-700 mb-2">
              Motivo do Bloqueio
            </h4>
            <p className="text-gray-600">{blockedUser.reason}</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <motion.button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit className="h-4 w-4" />
              Editar
            </motion.button>
            <motion.button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Fechar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
