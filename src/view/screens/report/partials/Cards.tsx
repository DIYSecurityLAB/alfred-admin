import { ReportedDeposit } from '@/domain/entities/report.entity';
import { motion } from 'framer-motion';
import {
  Bitcoin,
  Calendar,
  CreditCard,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface ReportCardsProps {
  reports: ReportedDeposit[];
  onViewDetails: (report: ReportedDeposit) => void;
  canViewDetails?: boolean;
  canManageSales?: boolean;
}

export function ReportCards({
  reports,
  onViewDetails,
  canViewDetails = true,
  canManageSales = false,
}: ReportCardsProps) {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'canceled':
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
            <div className="font-mono text-sm text-gray-600 break-all">
              {report.transactionId.substring(0, 12)}...
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusClass(report.status)}`}
            >
              {report.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center">
                <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                Método:
              </span>
              <span className="text-gray-700 font-medium">
                {report.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center">
                <Bitcoin className="h-4 w-4 mr-1 text-amber-500" />
                Crypto:
              </span>
              <span className="text-gray-700 font-medium">
                {report.cryptoType}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Valor:</span>
              <span className="text-gray-700 font-medium">
                R$ {report.amount ? report.amount.toFixed(2) : '0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Valor Crypto:</span>
              <span className="text-gray-700 font-medium">
                {report.cryptoValue.toFixed(8)} {report.cryptoType}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                Data:
              </span>
              <span className="text-gray-700">{report.transactionDate}</span>
            </div>
          </div>

          {canViewDetails && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <motion.button
                onClick={() => onViewDetails(report)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 
                  ${
                    canManageSales
                      ? 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      : 'bg-gray-50 text-gray-500 cursor-default'
                  } rounded-lg transition-colors`}
                whileHover={canManageSales ? { scale: 1.02 } : {}}
                whileTap={canManageSales ? { scale: 0.98 } : {}}
              >
                {canManageSales ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {canManageSales ? 'Ver detalhes' : 'Visualização limitada'}
                </span>
              </motion.button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
