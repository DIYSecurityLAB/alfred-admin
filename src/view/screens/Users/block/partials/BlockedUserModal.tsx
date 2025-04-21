import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BlockedUserData } from '../useBlockedUser';

interface BlockedUserModalProps {
  blockedUser?: BlockedUserData;
  onClose: () => void;
  onSubmit: (data: {
    documentId?: string;
    username?: string;
    userId?: string;
    reason: string;
  }) => Promise<void>;
}

export function BlockedUserModal({
  blockedUser,
  onClose,
  onSubmit,
}: BlockedUserModalProps) {
  const [formData, setFormData] = useState({
    documentId: '',
    username: '',
    userId: '',
    reason: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockMethod, setBlockMethod] = useState<
    'document' | 'username' | 'userId'
  >(
    blockedUser?.documentId
      ? 'document'
      : blockedUser?.username
        ? 'username'
        : 'userId',
  );

  useEffect(() => {
    if (blockedUser) {
      setFormData({
        documentId: blockedUser.documentId || '',
        username: blockedUser.username || '',
        userId: blockedUser.userId || '',
        reason: blockedUser.reason,
      });
    }
  }, [blockedUser]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (blockMethod === 'document' && !formData.documentId.trim()) {
      newErrors.documentId = 'Documento é obrigatório';
    }

    if (blockMethod === 'username' && !formData.username.trim()) {
      newErrors.username = 'Username é obrigatório';
    }

    if (blockMethod === 'userId' && !formData.userId.trim()) {
      newErrors.userId = 'ID do usuário é obrigatório';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Razão é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const submitData = {
      ...(blockMethod === 'document'
        ? { documentId: formData.documentId }
        : {}),
      ...(blockMethod === 'username' ? { username: formData.username } : {}),
      ...(blockMethod === 'userId' ? { userId: formData.userId } : {}),
      reason: formData.reason,
    };

    try {
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            {blockedUser ? 'Editar Usuário Bloqueado' : 'Bloquear Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {!blockedUser && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de bloqueio
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBlockMethod('document')}
                  className={`p-2 text-sm text-center rounded-md border ${
                    blockMethod === 'document'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Documento
                </button>
                <button
                  type="button"
                  onClick={() => setBlockMethod('username')}
                  className={`p-2 text-sm text-center rounded-md border ${
                    blockMethod === 'username'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Username
                </button>
                <button
                  type="button"
                  onClick={() => setBlockMethod('userId')}
                  className={`p-2 text-sm text-center rounded-md border ${
                    blockMethod === 'userId'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  ID do Usuário
                </button>
              </div>
            </div>
          )}

          {(blockMethod === 'document' || blockedUser?.documentId) && (
            <div className="mb-4">
              <label
                htmlFor="documentId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Documento
              </label>
              <input
                type="text"
                id="documentId"
                value={formData.documentId}
                onChange={(e) =>
                  setFormData({ ...formData, documentId: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.documentId
                    ? 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
                } focus:ring-opacity-50 transition-colors`}
                placeholder="Ex: 12345678900"
                disabled={
                  blockedUser !== undefined || blockMethod !== 'document'
                }
              />
              {errors.documentId && (
                <p className="mt-1 text-sm text-red-600">{errors.documentId}</p>
              )}
            </div>
          )}

          {(blockMethod === 'username' || blockedUser?.username) && (
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.username
                    ? 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
                } focus:ring-opacity-50 transition-colors`}
                placeholder="Ex: joaosilva"
                disabled={
                  blockedUser !== undefined || blockMethod !== 'username'
                }
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
          )}

          {(blockMethod === 'userId' || blockedUser?.userId) && (
            <div className="mb-4">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID do Usuário
              </label>
              <input
                type="text"
                id="userId"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.userId
                    ? 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
                } focus:ring-opacity-50 transition-colors`}
                placeholder="Ex: 646e7154-ecab-4d41-a992-e564a57062c1"
                disabled={blockedUser !== undefined || blockMethod !== 'userId'}
              />
              {errors.userId && (
                <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Razão do bloqueio
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-md ${
                errors.reason
                  ? 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-200'
                  : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
              } focus:ring-opacity-50 transition-colors`}
              rows={3}
              placeholder="Explique o motivo do bloqueio"
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : blockedUser ? (
                'Atualizar'
              ) : (
                'Bloquear'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
