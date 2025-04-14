import React from 'react';
import { Eye, Edit2, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User } from '../../../data/types';

interface UserTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
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

export function UserTable({
  users,
  onViewDetails,
  onEdit,
  onToggleStatus,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface">
            <th className="text-left py-4 px-4">Username</th>
            <th className="text-left py-4 px-4">Email</th>
            <th className="text-left py-4 px-4">Nível</th>
            <th className="text-left py-4 px-4">Status</th>
            <th className="text-left py-4 px-4">Data de Criação</th>
            <th className="text-left py-4 px-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-surface hover:bg-background/50"
            >
              <td className="py-4 px-4 font-medium">{user.username}</td>
              <td className="py-4 px-4">{user.email}</td>
              <td className="py-4 px-4">
                <span className={`px-2.5 py-1 rounded-full text-sm font-medium 
                  ${user.level >= 4 ? 'bg-purple-500/20 text-purple-600' : 
                    user.level >= 3 ? 'bg-blue-500/20 text-blue-600' : 
                    user.level >= 2 ? 'bg-green-500/20 text-green-600' : 
                    'bg-gray-200 text-gray-700'}`}
                >
                  {getLevelName(user.level)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                    user.isActive
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-red-500/20 text-red-600'
                  }`}
                >
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="py-4 px-4">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-1">
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
                    title={user.isActive ? "Desativar" : "Ativar"}
                  >
                    <ToggleRight className={`h-5 w-5 ${user.isActive ? "text-green-500" : "text-red-500"}`} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
