import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Copy, 
  Calendar, 
  User, 
  Phone, 
  Wallet, 
  Network, 
  CreditCard,
  FileText,
  Tag,
  DollarSign,
  Bitcoin,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface ReportDetailsModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  report: any;
  onClose: () => void;
}

export function ReportDetailsModal({ report, onClose }: ReportDetailsModalProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusIcon = () => {
    switch (report.status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />;
      case 'PENDING':
        return <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-rose-500 mr-2" />;
      case 'FAILED':
        return <AlertTriangle className="h-5 w-5 text-rose-500 mr-2" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completado';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelado';
      case 'FAILED':
        return 'Falhou';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-emerald-600';
      case 'PENDING':
        return 'text-amber-600';
      case 'CANCELLED':
        return 'text-rose-600';
      case 'FAILED':
        return 'text-rose-600';
      default:
        return 'text-gray-600';
    }
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modal = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 400 } }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Detalhes do Depósito</h2>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fechar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-5 w-5 text-gray-500" />
            </motion.button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm text-gray-500">ID da Transação</h3>
                </div>
                <motion.button 
                  onClick={() => handleCopy(report.transactionId, 'transactionId')} 
                  className="p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                  title="Copiar ID"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied === 'transactionId' ? 
                    <CheckCircle className="h-5 w-5 text-emerald-500" /> : 
                    <Copy className="h-5 w-5 text-blue-500" />
                  }
                </motion.button>
              </div>
              <p className="text-xl font-medium mt-1 font-mono text-gray-800">{report.transactionId}</p>
            </div>

            <div className="flex items-center">
              {getStatusIcon()}
              <span className={`text-lg font-medium ${getStatusColor(report.status)}`}>
                {getStatusText(report.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-1">
                    <User className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-500">Usuário</h3>
                  </div>
                  <p className="text-lg font-medium text-gray-800">
                    {report.username || 'N/A'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <Phone className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-500">Telefone</h3>
                  </div>
                  <p className="text-lg font-medium text-gray-800">
                    {report.phone}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-500">Data da Transação</h3>
                  </div>
                  <p className="font-medium text-gray-800">
                    {report.transactionDate}
                  </p>
                </div>

                {report.documentId && (
                  <div>
                    <div className="flex items-center mb-1">
                      <FileText className="h-4 w-4 text-blue-500 mr-2" />
                      <h3 className="text-sm text-gray-500">Documento</h3>
                    </div>
                    <p className="font-medium text-gray-800">
                      {report.documentId}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-1">
                    <CreditCard className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-500">Método de Pagamento</h3>
                  </div>
                  <p className="text-lg font-medium text-gray-800">
                    {report.paymentMethod === 'PIX' && 'PIX'}
                    {report.paymentMethod === 'CREDIT_CARD' && 'Cartão de Crédito'}
                    {report.paymentMethod === 'CRYPTO' && 'Criptomoeda'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <Wallet className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-500">Carteira</h3>
                  </div>
                  <p className="text-lg font-medium truncate text-gray-800">
                    {report.coldWallet}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <Network className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-500">Rede</h3>
                  </div>
                  <p className="text-lg font-medium text-gray-800">
                    {report.network}
                  </p>
                </div>

                {report.cupom && (
                  <div>
                    <div className="flex items-center mb-1">
                      <Tag className="h-4 w-4 text-blue-500 mr-2" />
                      <h3 className="text-sm text-gray-500">Cupom</h3>
                    </div>
                    <p className="text-lg font-medium text-gray-800">
                      {report.cupom}
                      {report.discountValue && (
                        <span className="text-sm ml-2 text-emerald-600">
                          ({report.discountType === 'percentage' ? report.discountValue + '%' : 'R$ ' + report.discountValue})
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
              <h3 className="text-lg font-medium mb-2 text-gray-800">Valores</h3>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-emerald-500 mr-2" />
                  <span className="text-gray-700">Valor em BRL</span>
                </div>
                <span className="text-lg font-medium text-gray-800">R$ {report.valueBRL.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Bitcoin className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-gray-700">Valor em BTC</span>
                </div>
                <span className="text-lg font-medium text-gray-800">{report.valueBTC.toFixed(8)} BTC</span>
              </div>
              
              {report.valueCollected !== undefined && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-gray-700">Valor Coletado</span>
                  </div>
                  <span className="text-lg font-medium text-gray-800">R$ {report.valueCollected.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <motion.button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Fechar
              </motion.button>
              <motion.button
                className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Confirmar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}