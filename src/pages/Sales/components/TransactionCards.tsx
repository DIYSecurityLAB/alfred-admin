import React from 'react';
import { Eye, Edit2, Calendar, CreditCard, DollarSign, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Transaction, TransactionStatus } from '../../../data/types';

interface TransactionCardsProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
  onUpdateStatus: (transaction: Transaction) => void;
}

// Função auxiliar para exibir o status da transação
const getStatusInfo = (status: TransactionStatus) => {
  switch (status) {
    case 'pending':
      return { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-600' };
    case 'paid':
      return { label: 'Pago', color: 'bg-blue-500/20 text-blue-600' };
    case 'canceled':
      return { label: 'Cancelado', color: 'bg-red-500/20 text-red-600' };
    case 'review':
      return { label: 'Em revisão', color: 'bg-purple-500/20 text-purple-600' };
    case 'expired':
      return { label: 'Expirado', color: 'bg-gray-500/20 text-gray-600' };
    case 'refunded':
      return { label: 'Reembolsado', color: 'bg-orange-500/20 text-orange-600' };
    case 'complete':
      return { label: 'Completo', color: 'bg-green-500/20 text-green-600' };
    default:
      return { label: status, color: 'bg-gray-200 text-gray-700' };
  }
};

// Função auxiliar para exibir o método de pagamento
const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'PIX':
      return 'PIX';
    case 'CREDIT_CARD':
      return 'Cartão de crédito';
    case 'CRYPTO':
      return 'Criptomoeda';
    case 'BANK_TRANSFER':
      return 'Transferência bancária';
    default:
      return method;
  }
};

export function TransactionCards({
  transactions,
  onViewDetails,
  onUpdateStatus,
}: TransactionCardsProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const statusInfo = getStatusInfo(transaction.status);
        
        return (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background p-4 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                  <h3 className="text-lg font-medium">
                    R$ {transaction.valorBRL.toFixed(2)}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary">{transaction.transactionId}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-sm text-text-secondary">Método de pagamento:</p>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-primary" />
                  <p className="font-medium">{getPaymentMethodLabel(transaction.paymentMethod)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-text-secondary">Usuário:</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-primary" />
                  <p className="font-medium">{transaction.username || '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-text-secondary mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {new Date(transaction.createdAt).toLocaleDateString()} às {' '}
                {new Date(transaction.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex justify-end items-center gap-2 pt-2 border-t border-surface">
              <button
                onClick={() => onViewDetails(transaction)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1"
                title="Ver detalhes"
              >
                <Eye className="h-5 w-5 text-primary" />
                <span>Detalhes</span>
              </button>
              <button
                onClick={() => onUpdateStatus(transaction)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1"
                title="Atualizar status"
              >
                <Edit2 className="h-5 w-5 text-primary" />
                <span>Status</span>
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
