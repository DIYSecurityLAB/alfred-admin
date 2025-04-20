import { motion } from 'framer-motion';
import {
  Calendar,
  Edit2,
  Eye,
  ToggleRight,
  User as UserIcon,
} from 'lucide-react';
import type { User as UserType } from '../../../data/types';

interface UserCardsProps {
  users: UserType[];
  onViewDetails: (user: UserType) => void;
  onEdit: (user: UserType) => void;
  onToggleStatus: (user: UserType) => void;
}

// Função auxiliar para exibir o nível do usuário
const getLevelName = (level: number) => {
  switch (level) {
    case 0:
      return 'Básico';
    case 1:
      return 'Iniciante';
    case 2:
      return 'Intermediário';
    case 3:
      return 'Avançado';
    case 4:
      return 'Supervisor';
    case 5:
      return 'Administrador';
    default:
      return `Nível ${level}`;
  }
};

export function UserCards({
  users,
  onViewDetails,
  onEdit,
  onToggleStatus,
}: UserCardsProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background p-4 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-2 text-primary" />
              <h3 className="text-lg font-medium">{user.username}</h3>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                user.isActive
                  ? 'bg-green-500/20 text-green-600'
                  : 'bg-red-500/20 text-red-600'
              }`}
            >
              {user.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-sm text-text-secondary">Email:</p>
              <p className="font-medium truncate">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">Nível:</p>
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
          </div>

          <div className="flex items-center text-sm text-text-secondary mb-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              Criado em {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-end items-center gap-1 pt-2 border-t border-surface">
            <button
              onClick={() => onViewDetails(user)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title="Ver detalhes"
            >
              <Eye className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={() => onEdit(user)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              title="Editar nível"
            >
              <Edit2 className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={() => onToggleStatus(user)}
              className="p-2 hover:bg-amber-500/20 rounded-lg transition-colors"
              title={user.isActive ? 'Desativar' : 'Ativar'}
            >
              <ToggleRight
                className={`h-5 w-5 ${user.isActive ? 'text-green-500' : 'text-red-500'}`}
              />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
