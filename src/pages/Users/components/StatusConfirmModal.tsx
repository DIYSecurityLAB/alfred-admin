/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { CheckCircle, X, XCircle } from 'lucide-react';
import React from 'react';
// import type { User } from '../../../data/types';

interface StatusConfirmModalProps {
  user: any;
  onClose: () => void;
  onConfirm: () => Promise<any>;
}

export function StatusConfirmModal({
  user,
  onClose,
  onConfirm,
}: StatusConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error updating user status:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {user.isActive ? 'Desativar Usuário' : 'Ativar Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Fechar"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-6 py-2">
          <div
            className={`${user.isActive ? 'bg-red-50' : 'bg-green-50'} p-3 rounded-full mb-4`}
          >
            {user.isActive ? (
              <XCircle className="h-8 w-8 text-red-500" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-500" />
            )}
          </div>
          <h3 className="text-lg font-medium mb-2">
            {user.isActive
              ? `Tem certeza que deseja desativar o usuário ${user.username}?`
              : `Tem certeza que deseja reativar o usuário ${user.username}?`}
          </h3>
          <p className="text-text-secondary">
            {user.isActive
              ? 'O usuário não poderá mais acessar o sistema até que seja reativado.'
              : 'O usuário poderá acessar novamente o sistema após a reativação.'}
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg hover:bg-background transition-colors border border-surface"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2.5 text-white rounded-lg transition-colors disabled:opacity-50 ${
              user.isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isSubmitting
              ? 'Processando...'
              : user.isActive
                ? 'Desativar'
                : 'Ativar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
