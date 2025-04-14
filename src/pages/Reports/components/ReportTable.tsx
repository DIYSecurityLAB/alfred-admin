import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import type { DepositReport } from '../../../data/types';

interface ReportTableProps {
  reports: DepositReport[];
  onViewDetails: (report: DepositReport) => void;
}

export function ReportTable({ reports, onViewDetails }: ReportTableProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complet') || statusLower === 'paid') {
      return 'bg-green-900/20 text-green-400 border border-green-800';
    } else if (statusLower.includes('pend') || statusLower === 'review') {
      return 'bg-yellow-900/20 text-yellow-400 border border-yellow-800';
    } else if (statusLower.includes('cancel') || statusLower.includes('fail') || statusLower === 'expired' || statusLower === 'refunded') {
      return 'bg-red-900/20 text-red-400 border border-red-800';
    } else {
      return 'bg-gray-900/20 text-gray-400 border border-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'COMPLETED': 'Completado',
      'PENDING': 'Pendente',
      'CANCELLED': 'Cancelado',
      'FAILED': 'Falhou',
      'pending': 'Pendente',
      'paid': 'Pago',
      'canceled': 'Cancelado',
      'review': 'Em Revisão',
      'expired': 'Expirado',
      'refunded': 'Reembolsado',
      'complete': 'Completado'
    };
    
    return statusMap[status] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      'PIX': 'PIX',
      'CREDIT_CARD': 'Cartão de Crédito',
      'CRYPTO': 'Criptomoeda',
      'CARD': 'Cartão',
      'BANK_TRANSFER': 'Transferência Bancária',
      'WISE': 'Wise',
      'TICKET': 'Boleto',
      'USDT': 'USDT',
      'SWIFT': 'Swift',
      'PAYPAL': 'PayPal'
    };
    
    return methodMap[method] || method;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-background border-b border-surface">
            <th className="py-3 px-4 font-medium text-text-secondary">ID Transação</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Usuário</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Data</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Método</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Valor (BRL)</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Status</th>
            <th className="py-3 px-4 font-medium text-text-secondary text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <motion.tr
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`border-b border-surface ${index % 2 === 0 ? 'bg-surface' : 'bg-background'} hover:bg-primary/5 transition-colors`}
            >
              <td className="py-4 px-4 font-medium text-primary">{report.transactionId}</td>
              <td className="py-4 px-4">{report.username || 'N/A'}</td>
              <td className="py-4 px-4">{report.transactionDate}</td>
              <td className="py-4 px-4">{getPaymentMethodText(report.paymentMethod)}</td>
              <td className="py-4 px-4 font-medium">R$ {report.valueBRL.toFixed(2)}</td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                >
                  {getStatusText(report.status)}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="inline-flex items-center space-x-1">
                  <button
                    onClick={() => onViewDetails(report)}
                    className="p-2 hover:bg-blue-900/20 rounded-full transition-colors text-blue-400 hover:text-blue-300"
                    title="Ver detalhes"
                  >
                    <Eye className="h-5 w-5" />
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
