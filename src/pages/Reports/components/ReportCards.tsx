import React from 'react';
import { motion } from 'framer-motion';
import { Eye, CreditCard, Landmark, Bitcoin, Calendar, User, DollarSign, Wallet, FileText } from 'lucide-react';
import type { DepositReport } from '../../../data/types';

interface ReportCardsProps {
  reports: DepositReport[];
  onViewDetails: (report: DepositReport) => void;
}

export function ReportCards({ reports, onViewDetails }: ReportCardsProps) {
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

  const getPaymentIcon = (method: string) => {
    const methodLower = method.toLowerCase();
    if (methodLower.includes('pix')) {
      return <Landmark className="h-4 w-4 mr-1 text-green-500" />;
    } else if (methodLower.includes('card') || methodLower.includes('credit')) {
      return <CreditCard className="h-4 w-4 mr-1 text-blue-500" />;
    } else if (methodLower.includes('crypto') || methodLower.includes('btc') || methodLower.includes('usdt')) {
      return <Bitcoin className="h-4 w-4 mr-1 text-amber-500" />;
    } else if (methodLower.includes('bank') || methodLower.includes('transfer') || methodLower.includes('swift')) {
      return <FileText className="h-4 w-4 mr-1 text-purple-500" />;
    } else {
      return <DollarSign className="h-4 w-4 mr-1 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {reports.map((report, index) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="p-5 bg-surface rounded-lg border border-surface/30 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg truncate max-w-[200px]">{report.transactionId}</h3>
            <span
              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
            >
              {getStatusText(report.status)}
            </span>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-500" />
                Usuário:
              </span>
              <span className="font-medium truncate max-w-[180px]">
                {report.username || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                Data:
              </span>
              <span>{report.transactionDate}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                {getPaymentIcon(report.paymentMethod)}
                Método:
              </span>
              <span>
                {(() => {
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
                  return methodMap[report.paymentMethod] || report.paymentMethod;
                })()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                Valor:
              </span>
              <span className="font-medium">R$ {report.valueBRL.toFixed(2)}</span>
            </div>

            {report.cupom && (
              <div className="flex justify-between items-center">
                <span className="text-text-secondary flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-blue-500" />
                  Cupom:
                </span>
                <span className="font-medium text-blue-400">{report.cupom}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-3 border-t border-surface/30">
            <button
              onClick={() => onViewDetails(report)}
              className="p-2 hover:bg-blue-900/20 rounded-full transition-colors text-blue-400 hover:text-blue-300"
              title="Ver detalhes"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
