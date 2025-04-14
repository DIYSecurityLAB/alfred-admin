import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, XCircle, Calendar, User as UserIcon, Mail, Shield } from 'lucide-react';
import type { User } from '../../../data/types';

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
  onEdit?: () => void;
}

// Função auxiliar para exibir o nível do usuário
const getLevelName = (level: number) => {
  switch (level) {
    case 0: return 'Básico';
    case 1: return 'Iniciante';
    case 2: return 'Intermediário';
    case 3: return 'Avançado';
    case 4: return 'Supervisor';
    case 5: return 'Administrador';
    default: return `Nível ${level}`;
  }
};

export function UserDetailsModal({ user, onClose, onEdit }: UserDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detalhes do Usuário</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Username */}
          <div className="bg-background p-4 rounded-lg">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-sm text-text-secondary">Username</h3>
            </div>
            <p className="text-xl font-medium mt-1">{user.username}</p>
          </div>

          {/* Status */}
          <div className="flex items-center">
            {user.isActive ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span className={`text-lg font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {user.isActive ? 'Usuário Ativo' : 'Usuário Inativo'}
            </span>
          </div>

          {/* Informações detalhadas do usuário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Email */}
              <div>
                <div className="flex items-center mb-1">
                  <Mail className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Email</h3>
                </div>
                <p className="text-lg font-medium">
                  {user.email || 'N/A'}
                </p>
              </div>

              {/* Nome */}
              {user.name && (
                <div>
                  <h3 className="text-sm text-text-secondary mb-1">Nome</h3>
                  <p className="text-lg font-medium">
                    {user.name}
                  </p>
                </div>
              )}

              {/* Data de criação */}
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Registro</h3>
                </div>
                <p className="font-medium">
                  Criado em: {formatDate(user.createdAt)}
                </p>
                <p className="text-sm text-text-secondary">
                  Última atualização: {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Nível */}
              <div>
                <div className="flex items-center mb-1">
                  <Shield className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Nível de Acesso</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-sm font-medium 
                    ${user.level >= 4 ? 'bg-purple-500/20 text-purple-600' : 
                      user.level >= 3 ? 'bg-blue-500/20 text-blue-600' : 
                      user.level >= 2 ? 'bg-green-500/20 text-green-600' : 
                      'bg-gray-200 text-gray-700'}`}
                  >
                    {getLevelName(user.level)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  Nível {user.level}
                </p>
              </div>

              {/* Provider ID, se disponível */}
              {user.providerId && (
                <div>
                  <h3 className="text-sm text-text-secondary mb-1">Provider ID</h3>
                  <p className="text-base font-medium break-all">
                    {user.providerId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg hover:bg-background transition-colors border border-surface"
            >
              Fechar
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Editar Nível
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}