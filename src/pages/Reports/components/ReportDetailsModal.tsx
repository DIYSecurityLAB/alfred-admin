import React from 'react';
import { motion } from 'framer-motion';
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
import type { DepositReport } from '../../../data/types';

interface ReportDetailsModalProps {
  report: DepositReport;
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
        return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />;
      case 'PENDING':
        return <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500 mr-2" />;
      case 'FAILED':
        return <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />;
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
        return 'text-green-500';
      case 'PENDING':
        return 'text-yellow-500';
      case 'CANCELLED':
        return 'text-red-500';
      case 'FAILED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detalhes do Depósito</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* ID da Transação */}
          <div className="bg-background p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-sm text-text-secondary">ID da Transação</h3>
              </div>
              <button 
                onClick={() => handleCopy(report.transactionId, 'transactionId')} 
                className="p-1.5 hover:bg-primary/10 rounded-md transition-colors"
                title="Copiar ID"
              >
                {copied === 'transactionId' ? 
                  <CheckCircle className="h-5 w-5 text-green-500" /> : 
                  <Copy className="h-5 w-5 text-primary" />
                }
              </button>
            </div>
            <p className="text-xl font-medium mt-1 font-mono">{report.transactionId}</p>
          </div>

          {/* Status */}
          <div className="flex items-center">
            {getStatusIcon()}
            <span className={`text-lg font-medium ${getStatusColor(report.status)}`}>
              {getStatusText(report.status)}
            </span>
          </div>

          {/* Informações detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Usuário */}
              <div>
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Usuário</h3>
                </div>
                <p className="text-lg font-medium">
                  {report.username || 'N/A'}
                </p>
              </div>

              {/* Telefone */}
              <div>
                <div className="flex items-center mb-1">
                  <Phone className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Telefone</h3>
                </div>
                <p className="text-lg font-medium">
                  {report.phone}
                </p>
              </div>

              {/* Data da Transação */}
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Data da Transação</h3>
                </div>
                <p className="font-medium">
                  {report.transactionDate}
                </p>
              </div>

              {/* Documento */}
              {report.documentId && (
                <div>
                  <div className="flex items-center mb-1">
                    <FileText className="h-4 w-4 text-primary mr-2" />
                    <h3 className="text-sm text-text-secondary">Documento</h3>
                  </div>
                  <p className="font-medium">
                    {report.documentId}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Método de Pagamento */}
              <div>
                <div className="flex items-center mb-1">
                  <CreditCard className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Método de Pagamento</h3>
                </div>
                <p className="text-lg font-medium">
                  {report.paymentMethod === 'PIX' && 'PIX'}
                  {report.paymentMethod === 'CREDIT_CARD' && 'Cartão de Crédito'}
                  {report.paymentMethod === 'CRYPTO' && 'Criptomoeda'}
                </p>
              </div>

              {/* Carteira */}
              <div>
                <div className="flex items-center mb-1">
                  <Wallet className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Carteira</h3>
                </div>
                <p className="text-lg font-medium truncate">
                  {report.coldWallet}
                </p>
              </div>

              {/* Rede */}
              <div>
                <div className="flex items-center mb-1">
                  <Network className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Rede</h3>
                </div>
                <p className="text-lg font-medium">
                  {report.network}
                </p>
              </div>

              {/* Cupom */}
              {report.cupom && (
                <div>
                  <div className="flex items-center mb-1">
                    <Tag className="h-4 w-4 text-primary mr-2" />
                    <h3 className="text-sm text-text-secondary">Cupom</h3>
                  </div>
                  <p className="text-lg font-medium">
                    {report.cupom}
                    {report.discountValue && (
                      <span className="text-sm ml-2 text-green-500">
                        ({report.discountType === 'percentage' ? report.discountValue + '%' : 'R$ ' + report.discountValue})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Valores */}
          <div className="bg-background p-4 rounded-lg space-y-3">
            <h3 className="text-lg font-medium mb-2">Valores</h3>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                <span>Valor em BRL</span>
              </div>
              <span className="text-lg font-medium">R$ {report.valueBRL.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bitcoin className="h-5 w-5 text-amber-500 mr-2" />
                <span>Valor em BTC</span>
              </div>
              <span className="text-lg font-medium">{report.valueBTC.toFixed(8)} BTC</span>
            </div>
            
            {report.valueCollected !== undefined && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
                  <span>Valor Coletado</span>
                </div>
                <span className="text-lg font-medium">R$ {report.valueCollected.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg hover:bg-background transition-colors border border-surface"
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
