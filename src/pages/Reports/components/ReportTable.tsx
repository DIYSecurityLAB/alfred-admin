import React from "react";
import { motion } from "framer-motion";
import { Eye, Clipboard, Check } from "lucide-react";

interface ReportTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reports: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onViewDetails: (report: any) => void;
}

export function ReportTable({ reports, onViewDetails }: ReportTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("complet") || statusLower === "paid") {
      return "bg-green-100 text-green-600 border border-green-300";
    } else if (statusLower.includes("pend") || statusLower === "review") {
      return "bg-yellow-100 text-yellow-600 border border-yellow-300";
    } else if (
      statusLower.includes("cancel") ||
      statusLower.includes("fail") ||
      statusLower === "expired" ||
      statusLower === "refunded"
    ) {
      return "bg-red-100 text-red-600 border border-red-300";
    } else {
      return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      COMPLETED: "Completado",
      PENDING: "Pendente",
      CANCELLED: "Cancelado",
      FAILED: "Falhou",
      pending: "Pendente",
      paid: "Pago",
      canceled: "Cancelado",
      review: "Em Revisão",
      expired: "Expirado",
      refunded: "Reembolsado",
      complete: "Completado",
    };

    return statusMap[status] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      PIX: "PIX",
      CREDIT_CARD: "Cartão de Crédito",
      CRYPTO: "Criptomoeda",
      CARD: "Cartão",
      BANK_TRANSFER: "Transferência Bancária",
      WISE: "Wise",
      TICKET: "Boleto",
      USDT: "USDT",
      SWIFT: "Swift",
      PAYPAL: "PayPal",
    };

    return methodMap[method] || method;
  };

  const tableVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <motion.table
        className="w-full text-left bg-white"
        variants={tableVariants}
        initial="hidden"
        animate="show"
      >
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="py-4 px-6 font-semibold text-gray-600">
              ID Transação
            </th>
            <th className="py-4 px-6 font-semibold text-gray-600">Usuário</th>
            <th className="py-4 px-6 font-semibold text-gray-600">Data</th>
            <th className="py-4 px-6 font-semibold text-gray-600">Método</th>
            <th className="py-4 px-6 font-semibold text-gray-600">
              Valor (BRL)
            </th>
            <th className="py-4 px-6 font-semibold text-gray-600">Status</th>
            <th className="py-4 px-6 font-semibold text-gray-600 text-right">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <motion.tr
              key={report.id}
              variants={rowVariants}
              className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-300`}
              whileHover={{ scale: 1.01 }}
            >
              <td className="py-4 px-6 font-medium text-blue-600 flex items-center gap-2">
                <span className="truncate max-w-[180px]">
                  {report.transactionId}
                </span>
                <button
                  onClick={() => handleCopy(report.transactionId)}
                  className="p-1 hover:bg-blue-100 rounded-md transition-colors"
                  title="Copiar ID"
                >
                  {copiedId === report.transactionId ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clipboard className="h-4 w-4 text-blue-400" />
                  )}
                </button>
              </td>
              <td className="py-4 px-6 text-gray-800">
                {report.username || "N/A"}
              </td>
              <td className="py-4 px-6 text-gray-800">
                {report.transactionDate}
              </td>
              <td className="py-4 px-6 text-gray-800">
                {getPaymentMethodText(report.paymentMethod)}
              </td>
              <td className="py-4 px-6 font-medium text-gray-900">
                R$ {report.valueBRL.toFixed(2)}
              </td>
              <td className="py-4 px-6">
                <span
                  className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {getStatusText(report.status)}
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="inline-flex items-center space-x-1">
                  <button
                    onClick={() => onViewDetails(report)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 text-blue-500 hover:text-blue-700 border border-transparent hover:border-blue-200 hover:shadow-sm"
                    title="Ver detalhes"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}
