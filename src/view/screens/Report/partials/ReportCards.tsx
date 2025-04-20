import { motion } from 'framer-motion';
import {
  Bitcoin,
  Calendar,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Landmark,
  User,
} from 'lucide-react';

interface ReportCardsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reports: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewDetails: (report: any) => void;
}

export function ReportCards({ reports, onViewDetails }: ReportCardsProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complet') || statusLower === 'paid') {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    } else if (statusLower.includes('pend') || statusLower === 'review') {
      return 'bg-amber-50 text-amber-600 border border-amber-200';
    } else if (
      statusLower.includes('cancel') ||
      statusLower.includes('fail') ||
      statusLower === 'expired' ||
      statusLower === 'refunded'
    ) {
      return 'bg-rose-50 text-rose-600 border border-rose-200';
    } else {
      return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      COMPLETED: 'Completado',
      PENDING: 'Pendente',
      CANCELLED: 'Cancelado',
      FAILED: 'Falhou',
      pending: 'Pendente',
      paid: 'Pago',
      canceled: 'Cancelado',
      review: 'Em Revisão',
      expired: 'Expirado',
      refunded: 'Reembolsado',
      complete: 'Completado',
    };

    return statusMap[status] || status;
  };

  const getPaymentIcon = (method: string) => {
    const methodLower = method.toLowerCase();
    if (methodLower.includes('pix')) {
      return <Landmark className="h-4 w-4 mr-1 text-emerald-500" />;
    } else if (methodLower.includes('card') || methodLower.includes('credit')) {
      return <CreditCard className="h-4 w-4 mr-1 text-blue-500" />;
    } else if (
      methodLower.includes('crypto') ||
      methodLower.includes('btc') ||
      methodLower.includes('usdt')
    ) {
      return <Bitcoin className="h-4 w-4 mr-1 text-amber-500" />;
    } else if (
      methodLower.includes('bank') ||
      methodLower.includes('transfer') ||
      methodLower.includes('swift')
    ) {
      return <FileText className="h-4 w-4 mr-1 text-purple-500" />;
    } else {
      return <DollarSign className="h-4 w-4 mr-1 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {reports.map((report, index) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
          className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
          whileHover={{ y: -5 }}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />

          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-800 truncate max-w-[200px]">
              {report.transactionId}
            </h3>
            <span
              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                report.status,
              )}`}
            >
              {getStatusText(report.status)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-1 text-blue-400" />
                Usuário:
              </span>
              <span className="font-medium text-gray-700 truncate max-w-[180px]">
                {report.username || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                Data:
              </span>
              <span className="text-gray-700">{report.transactionDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center">
                {getPaymentIcon(report.paymentMethod)}
                Método:
              </span>
              <span className="text-gray-700">
                {(() => {
                  const methodMap: Record<string, string> = {
                    PIX: 'PIX',
                    CREDIT_CARD: 'Cartão de Crédito',
                    CRYPTO: 'Criptomoeda',
                    CARD: 'Cartão',
                    BANK_TRANSFER: 'Transferência Bancária',
                    WISE: 'Wise',
                    TICKET: 'Boleto',
                    USDT: 'USDT',
                    SWIFT: 'Swift',
                    PAYPAL: 'PayPal',
                  };
                  return (
                    methodMap[report.paymentMethod] || report.paymentMethod
                  );
                })()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-emerald-500" />
                Valor:
              </span>
              <span className="font-medium text-gray-800">
                R$ {report.valueBRL.toFixed(2)}
              </span>
            </div>

            {report.cupom && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-blue-500" />
                  Cupom:
                </span>
                <span className="font-medium text-blue-500">
                  {report.cupom}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <motion.button
              onClick={() => onViewDetails(report)}
              className="p-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors text-blue-600"
              title="Ver detalhes"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
