import React from 'react';
import { Eye, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Transaction, TransactionStatus } from '../../../data/types';

interface TransactionTableProps {
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

export function TransactionTable({
  transactions,
  onViewDetails,
  onUpdateStatus,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface">
            <th className="text-left py-4 px-4">ID da Transação</th>
            <th className="text-left py-4 px-4">Valor (R$)</th>
            <th className="text-left py-4 px-4">Método</th>
            <th className="text-left py-4 px-4">Status</th>
            <th className="text-left py-4 px-4">Data</th>
            <th className="text-left py-4 px-4">Usuário</th>
            <th className="text-left py-4 px-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const statusInfo = getStatusInfo(transaction.status);
            
            return (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-surface hover:bg-background/50"
              >
                <td className="py-4 px-4 font-medium">{transaction.transactionId}</td>
                <td className="py-4 px-4">R$ {transaction.valorBRL.toFixed(2)}</td>
                <td className="py-4 px-4">{getPaymentMethodLabel(transaction.paymentMethod)}</td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">{transaction.username || '-'}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewDetails(transaction)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="h-5 w-5 text-primary" />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(transaction)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      title="Atualizar status"
                    >
                      <Edit2 className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
