import { UseCases } from '@/domain/usecases/UseCases';
import { Button } from '@/view/components/Button';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle, Shield, X } from 'lucide-react';
import { useState } from 'react';

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BlockUserPayload {
  userId?: string;
  username?: string;
  documentId?: string;
  reason: string | null;
}

export function BlockUserModal({ isOpen, onClose }: BlockUserModalProps) {
  const queryClient = useQueryClient();
  const [blockType, setBlockType] = useState<
    'userId' | 'username' | 'documentId'
  >('userId');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setBlockType('userId');
    setUserId('');
    setUsername('');
    setDocumentId('');
    setReason('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBlockUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const blockPayload: BlockUserPayload = {
        reason: reason.trim() || null,
      };

      // Definir o payload com base no tipo de bloqueio
      if (blockType === 'userId') {
        if (!userId.trim()) {
          throw new Error('ID do usuário é obrigatório');
        }
        blockPayload.userId = userId.trim();
      } else if (blockType === 'username') {
        if (!username.trim()) {
          throw new Error('Nome de usuário é obrigatório');
        }
        blockPayload.username = username.trim();
      } else {
        if (!documentId.trim()) {
          throw new Error('Número do documento é obrigatório');
        }
        blockPayload.documentId = documentId.trim();
      }

      const { result } = await UseCases.user.block.create.execute(blockPayload);

      if (result.type === 'ERROR') {
        throw new Error(result.error?.code || 'Erro ao bloquear usuário');
      }

      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });

      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao bloquear usuário');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Bloquear Usuário
            </h2>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fechar modal"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6">
          {success ? (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
              <div className="flex items-center text-green-700 mb-2">
                <Shield className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Usuário bloqueado com sucesso
                </span>
              </div>
              <p className="text-sm text-green-600">
                O usuário foi bloqueado e será redirecionado da plataforma.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Erro</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bloquear por
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setBlockType('userId')}
                    aria-pressed={blockType === 'userId'}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      blockType === 'userId'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    ID do Usuário
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlockType('username')}
                    aria-pressed={blockType === 'username'}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      blockType === 'username'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Username
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlockType('documentId')}
                    aria-pressed={blockType === 'documentId'}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      blockType === 'documentId'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Documento
                  </button>
                </div>
              </div>

              {blockType === 'userId' && (
                <div className="mb-6">
                  <label
                    htmlFor="userId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    ID do Usuário
                  </label>
                  <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Digite o ID do usuário"
                  />
                </div>
              )}

              {blockType === 'username' && (
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Digite o nome de usuário"
                  />
                </div>
              )}

              {blockType === 'documentId' && (
                <div className="mb-6">
                  <label
                    htmlFor="documentId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Número do Documento
                  </label>
                  <input
                    type="text"
                    id="documentId"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Digite o número do documento"
                  />
                </div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Motivo do Bloqueio (opcional)
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-24 resize-none"
                  placeholder="Descreva o motivo do bloqueio"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancelar
          </button>
          {!success && (
            <Button
              icon={<></>}
              label={isLoading ? 'Processando...' : 'Bloquear Usuário'}
              onClick={handleBlockUser}
              //   disabled={
              //     isLoading ||
              //     (blockType === 'userId' && !userId.trim()) ||
              //     (blockType === 'username' && !username.trim()) ||
              //     (blockType === 'documentId' && !documentId.trim())
              //   }
              //   className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
