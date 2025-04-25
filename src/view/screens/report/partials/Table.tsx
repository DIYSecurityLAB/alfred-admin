import { ReportedDeposit } from '@/domain/entities/report.entity';
import { motion } from 'framer-motion';
import { Eye, Lock } from 'lucide-react';

interface ReportTableProps {
  reports: ReportedDeposit[];
  onViewDetails: (report: ReportedDeposit) => void;
  canViewDetails?: boolean;
  canManageSales?: boolean;
}

export function ReportTable({
  reports,
  onViewDetails,
  canViewDetails = true,
  canManageSales = false,
}: ReportTableProps) {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
      case 'cancelled':
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 hover:overflow-hidden">
      <motion.table
        className="min-w-full text-left bg-white"
        variants={tableVariants}
        initial="hidden"
        animate="show"
      >
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              ID Transação
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Usuário
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Data
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Método
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Crypto
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Valor (BRL)
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <motion.tr
              key={report.id}
              variants={rowVariants}
              className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-300"
              whileHover={{ scale: 1.01 }}
            >
              <td className="py-3 px-4 font-mono text-sm text-gray-800">
                {report.transactionId.substring(0, 10)}...
              </td>
              <td className="py-3 px-4 text-gray-800">
                {report.username || 'N/A'}
              </td>
              <td className="py-3 px-4 text-gray-800">
                {report.transactionDate}
              </td>
              <td className="py-3 px-4 text-gray-800">
                {report.paymentMethod}
              </td>
              <td className="py-3 px-4 text-gray-800">{report.cryptoType}</td>
              <td className="py-3 px-4 font-medium text-gray-900">
                R$ {report.valueBRL.toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(report.status)}`}
                >
                  {report.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                {canViewDetails ? (
                  <motion.button
                    onClick={() => onViewDetails(report)}
                    className={`p-1.5 rounded-full transition-colors ${
                      canManageSales
                        ? 'text-blue-500 hover:bg-blue-50'
                        : 'text-blue-400'
                    }`}
                    whileHover={canManageSales ? { scale: 1.1 } : {}}
                    whileTap={canManageSales ? { scale: 0.9 } : {}}
                    title={
                      canManageSales ? 'Ver detalhes' : 'Visualizar somente'
                    }
                  >
                    <Eye className="h-5 w-5" />
                  </motion.button>
                ) : (
                  <span className="text-gray-400 flex items-center justify-center">
                    <Lock className="h-4 w-4" />
                  </span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}
