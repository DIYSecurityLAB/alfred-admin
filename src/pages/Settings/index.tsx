import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, X } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';

const configSchema = z.object({
  isMaintenanceMode: z.boolean(),
  isSwapPegActive: z.boolean()
});

type ConfigFormData = z.infer<typeof configSchema>;

export function Settings() {
  const { config, isLoading, error, updateConfig, isUpdating, clearError } = useConfig();

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      isMaintenanceMode: config?.isMaintenanceMode || false,
      isSwapPegActive: config?.isSwapPegActive || false
    },
    values: {
      isMaintenanceMode: config?.isMaintenanceMode || false,
      isSwapPegActive: config?.isSwapPegActive || false
    }
  });

  const onSubmit = async (data: ConfigFormData) => {
    await updateConfig(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-text-secondary mt-1">Gerencie as configurações do sistema</p>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-900/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Erro</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-lg p-6 shadow-sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Configurações Gerais</h2>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h3 className="font-medium">Modo Manutenção</h3>
                <p className="text-text-secondary text-sm">
                  Ative para colocar o site em modo de manutenção
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isMaintenanceMode')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <h3 className="font-medium">Ativar Swap Peg</h3>
                <p className="text-text-secondary text-sm">
                  Ativa ou desativa a função de swap peg no sistema
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isSwapPegActive')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isDirty || isUpdating}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}