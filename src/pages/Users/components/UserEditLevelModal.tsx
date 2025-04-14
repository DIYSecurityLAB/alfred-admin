import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import type { User } from '../../../data/types';

interface UserEditLevelModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (level: number) => Promise<any>;
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

export function UserEditLevelModal({ user, onClose, onSubmit }: UserEditLevelModalProps) {
  const [level, setLevel] = useState<number>(user.level);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(level);
    } catch (error) {
      console.error("Erro ao atualizar nível:", error);
    } finally {
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Editar Nível de Acesso</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <label className="text-lg font-medium">Usuário: {user.username}</label>
            </div>
            <p className="text-text-secondary mb-4">
              Selecione o nível de acesso para este usuário.
            </p>

            <div className="space-y-2">
              {[0, 1, 2, 3, 4, 5].map((levelOption) => (
                <div 
                  key={levelOption}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    level === levelOption 
                      ? 'border-primary bg-primary/10' 
                      : 'border-surface bg-background hover:bg-primary/5'
                  }`}
                  onClick={() => setLevel(levelOption)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`level-${levelOption}`}
                      name="level"
                      checked={level === levelOption}
                      onChange={() => setLevel(levelOption)}
                      className="mr-3 h-4 w-4 text-primary"
                    />
                    <div>
                      <label 
                        htmlFor={`level-${levelOption}`} 
                        className="font-medium cursor-pointer"
                      >
                        Nível {levelOption}: {getLevelName(levelOption)}
                      </label>
                      <p className="text-sm text-text-secondary">
                        {levelOption === 0 && 'Acesso básico ao sistema.'}
                        {levelOption === 1 && 'Pode acessar recursos básicos.'}
                        {levelOption === 2 && 'Pode acessar recursos intermediários.'}
                        {levelOption === 3 && 'Acesso avançado a recursos.'}
                        {levelOption === 4 && 'Supervisão e acesso a dados sensíveis.'}
                        {levelOption === 5 && 'Acesso administrativo completo.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg hover:bg-background transition-colors border border-surface"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || level === user.level}
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
