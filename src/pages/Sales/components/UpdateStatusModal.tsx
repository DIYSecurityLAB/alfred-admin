import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import type { Transaction, TransactionStatus } from '../../../data/types';

interface UpdateStatusModalProps {
  transaction: Transaction;
  onClose: () => void;
  onUpdateStatus: (id: string, status: TransactionStatus) => Promise<any>;
}

export function UpdateStatusModal({ transaction, onClose, onUpdateStatus }: UpdateStatusModalProps) {
  const [newStatus, setNewStatus] = useState<TransactionStatus>(transaction.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (newStatus === transaction.status) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdateStatus(transaction.id, newStatus);
      onClose();
    } catch (error) {
      console.error('Error updating transaction status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'canceled', label: 'Cancelado' },
    { value: 'review', label: 'Em revisão' },
    { value: 'expired', label: 'Expirado' },
    { value: 'refunded', label: 'Reembolsado' },
    { value: 'complete', label: 'Completo' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Atualizar Status da Transação</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Fechar"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-text-secondary mb-2">Transação:</p>
            <p className="font-medium">{transaction.transactionId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status Atual</label>
            <div className="px-4 py-2.5 bg-background rounded-lg border border-surface">
              {
                {
                  'pending': 'Pendente',
                  'paid': 'Pago',
                  'canceled': 'Cancelado',
                  'review': 'Em revisão',
                  'expired': 'Expirado',
                  'refunded': 'Reembolsado',
                  'complete': 'Completo'
                }[transaction.status]
              }
            </div>
          </div>
          
          <div>
            <label htmlFor="newStatus" className="block text-sm font-medium mb-2">Novo Status</label>
            <select
              id="newStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as TransactionStatus)}
              className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
              disabled={isSubmitting}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">Observações (opcional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary min-h-[100px] resize-y"
              placeholder="Adicione observações sobre a alteração..."
              disabled={isSubmitting}
            />
          </div>

          {newStatus !== transaction.status && (
            <div className="flex items-start p-3 bg-amber-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                Você está alterando o status da transação de 
                <strong> {
                  {
                    'pending': 'Pendente',
                    'paid': 'Pago',
                    'canceled': 'Cancelado',
                    'review': 'Em revisão',
                    'expired': 'Expirado',
                    'refunded': 'Reembolsado',
                    'complete': 'Completo'
                  }[transaction.status]
                } </strong>
                para 
                <strong> {
                  {
                    'pending': 'Pendente',
                    'paid': 'Pago',
                    'canceled': 'Cancelado',
                    'review': 'Em revisão',
                    'expired': 'Expirado',
                    'refunded': 'Reembolsado',
                    'complete': 'Completo'
                  }[newStatus]
                }</strong>. 
                Esta ação será registrada no histórico.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg hover:bg-background transition-colors border border-surface"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || newStatus === transaction.status}
            className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Atualizar Status'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
