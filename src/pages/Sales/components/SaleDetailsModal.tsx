import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Sale } from '../../../data/types';

interface SaleDetailsModalProps {
  sale: Sale;
  onClose: () => void;
}

export function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface rounded-lg p-6 w-full max-w-lg mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detalhes da Venda</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-text-secondary">ID da Venda</h3>
            <p className="text-lg font-medium">{sale.id}</p>
          </div>

          <div>
            <h3 className="text-sm text-text-secondary">ID do Usuário</h3>
            <p className="text-lg font-medium">{sale.userId}</p>
          </div>

          <div>
            <h3 className="text-sm text-text-secondary">Status</h3>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                sale.status === 'completed'
                  ? 'bg-green-500/20 text-green-500'
                  : sale.status === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {sale.status}
            </span>
          </div>

          <div>
            <h3 className="text-sm text-text-secondary">Método de Pagamento</h3>
            <p className="text-lg font-medium">{sale.paymentMethod}</p>
          </div>

          <div>
            <h3 className="text-sm text-text-secondary">Data</h3>
            <p className="text-lg font-medium">
              {new Date(sale.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm text-text-secondary mb-2">Itens</h3>
            <div className="space-y-2">
              {sale.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-background p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-text-secondary">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-surface">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Total</h3>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(sale.total)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}