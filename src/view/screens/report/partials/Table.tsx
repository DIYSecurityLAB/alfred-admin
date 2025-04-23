import { ReportedDeposit } from '@/domain/entities/report.entity';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface ReportTableProps {
  reports: ReportedDeposit[];
  onViewDetails: (report: ReportedDeposit) => void;
}

export function ReportTable({ reports, onViewDetails }: ReportTableProps) {
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

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return date; // Return original if parsing fails
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
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
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
              Valor Crypto
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
                {formatDate(report.transactionDate)}
              </td>
              <td className="py-3 px-4 text-gray-800">
                {report.paymentMethod}
              </td>
              <td className="py-3 px-4 text-gray-800">{report.cryptoType}</td>
              <td className="py-3 px-4 font-medium text-gray-900">
                R$ {report.valueBRL.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-gray-800">
                {report.assetValue.toFixed(8)}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(report.status)}`}
                >
                  {report.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <motion.button
                  onClick={() => onViewDetails(report)}
                  className="p-1.5 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Eye className="h-5 w-5" />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}
