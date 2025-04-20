import { Loading } from '@/view/components/Loading';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Loader,
  Power,
  Save,
  Settings as SettingsIcon,
  X,
} from 'lucide-react';
import { useSettings } from './useSettings';

export function Settings() {
  const {
    form,
    error,
    variants,
    isLoading,
    isUpdating,
    collapsedHeader,
    onsubmit,
    clearError,
    toggleHeader,
  } = useSettings();

  if (isLoading) {
    return <Loading label="Carregando configurações..." />;
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={variants.container}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className={`bg-white rounded-lg shadow-md border border-blue-50 p-6 mb-8 transition-all duration-500 ${
          collapsedHeader ? 'cursor-pointer' : ''
        }`}
        variants={variants.item}
        onClick={collapsedHeader ? toggleHeader : undefined}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <SettingsIcon className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">
                Configurações
              </h1>
              {!collapsedHeader && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-600">
                    Gerencie as configurações do sistema
                  </p>
                </motion.div>
              )}
            </div>
          </div>
          <button
            onClick={toggleHeader}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {collapsedHeader ? (
              <ChevronDown className="h-5 w-5 text-blue-500" />
            ) : (
              <ChevronUp className="h-5 w-5 text-blue-500" />
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 shadow-sm"
            variants={variants.error}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
      >
        <form onSubmit={onsubmit} className="space-y-6 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Power className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Configurações Gerais
              </h2>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-5 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
            >
              <div>
                <h3 className="font-medium text-gray-800">Modo Manutenção</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Ative para colocar o site em modo de manutenção
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...form.register('isMaintenanceMode')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-5 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
            >
              <div>
                <h3 className="font-medium text-gray-800">Ativar Swap Peg</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Ativa ou desativa a função de swap peg no sistema
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...form.register('isSwapPegActive')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </motion.div>

            <div className="flex items-center gap-2 mb-4 mt-8">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Configurações de Taxas
              </h2>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-5 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
            >
              <div className="mb-3">
                <h3 className="font-medium text-gray-800">
                  Taxa Sem Cupom (Abaixo do Valor)
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Taxa aplicada para transações sem cupom abaixo do valor limite
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...form.register('feeWithoutCouponBelowValue', {
                    valueAsNumber: true,
                  })}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  placeholder="0.00"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-5 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
            >
              <div className="mb-3">
                <h3 className="font-medium text-gray-800">
                  Taxa Sem Cupom (Acima do Valor)
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Taxa aplicada para transações sem cupom acima do valor limite
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...form.register('feeWithoutCouponAboveValue', {
                    valueAsNumber: true,
                  })}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  placeholder="0.00"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-5 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
            >
              <div className="mb-3">
                <h3 className="font-medium text-gray-800">
                  Taxa Com Cupom (Acima do Valor)
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Taxa aplicada para transações com cupom acima do valor limite
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...form.register('feeWithCouponAboveValue', {
                    valueAsNumber: true,
                  })}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  placeholder="0.00"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-5 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
            >
              <div className="mb-3">
                <h3 className="font-medium text-gray-800">Valor de Corte</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Valor base para cálculo das taxas maiores
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...form.register('feeValue', { valueAsNumber: true })}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  placeholder="0.00"
                />
              </div>
            </motion.div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <motion.button
              type="submit"
              disabled={!form.isDirty || isUpdating}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {isUpdating ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
