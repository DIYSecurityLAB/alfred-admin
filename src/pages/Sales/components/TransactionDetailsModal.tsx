import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, Calendar, DollarSign, CreditCard, User, Phone, 
  FileText, Tag, Bitcoin, CheckCircle, XCircle, Clock 
} from 'lucide-react';
import type { Transaction, TransactionStatus } from '../../../data/types';

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
  onUpdateStatus?: () => void;
}

// Função auxiliar para exibir o status da transação
const getStatusInfo = (status: TransactionStatus) => {
  switch (status) {
    case 'pending':
      return { 
        label: 'Pendente', 
        color: 'bg-yellow-500/20 text-yellow-600',
        icon: <Clock className="h-5 w-5 text-yellow-500 mr-2" />
      };
    case 'paid':
      return { 
        label: 'Pago', 
        color: 'bg-blue-500/20 text-blue-600',
        icon: <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
      };
    case 'canceled':
      return { 
        label: 'Cancelado', 
        color: 'bg-red-500/20 text-red-600',
        icon: <XCircle className="h-5 w-5 text-red-500 mr-2" />
      };
    case 'review':
      return { 
        label: 'Em revisão', 
        color: 'bg-purple-500/20 text-purple-600',
        icon: <FileText className="h-5 w-5 text-purple-500 mr-2" />
      };
    case 'expired':
      return { 
        label: 'Expirado', 
        color: 'bg-gray-500/20 text-gray-600',
        icon: <XCircle className="h-5 w-5 text-gray-500 mr-2" />
      };
    case 'refunded':
      return { 
        label: 'Reembolsado', 
        color: 'bg-orange-500/20 text-orange-600',
        icon: <DollarSign className="h-5 w-5 text-orange-500 mr-2" />
      };
    case 'complete':
      return { 
        label: 'Completo', 
        color: 'bg-green-500/20 text-green-600',
        icon: <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
      };
    default:
      return { 
        label: status, 
        color: 'bg-gray-200 text-gray-700',
        icon: <Clock className="h-5 w-5 text-gray-500 mr-2" />
      };
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

export function TransactionDetailsModal({ transaction, onClose, onUpdateStatus }: TransactionDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const statusInfo = getStatusInfo(transaction.status);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detalhes da Transação</h2>
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
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-sm text-text-secondary">ID da Transação</h3>
            </div>
            <p className="text-xl font-medium mt-1 font-mono">{transaction.transactionId}</p>
          </div>

          {/* Status */}
          <div className="flex items-center">
            {statusInfo.icon}
            <span className={`text-lg font-medium ${statusInfo.color.split(' ')[1]}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Informações detalhadas da transação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Valores */}
              <div>
                <div className="flex items-center mb-1">
                  <DollarSign className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Valores</h3>
                </div>
                <p className="text-lg font-medium">
                  R$ {transaction.valorBRL.toFixed(2)}
                </p>
                <p className="text-sm text-text-secondary">
                  {transaction.valorBTC} {transaction.cryptoType || 'BTC'}
                </p>
              </div>

              {/* Método de Pagamento */}
              <div>
                <div className="flex items-center mb-1">
                  <CreditCard className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Método de Pagamento</h3>
                </div>
                <p className="text-lg font-medium">
                  {getPaymentMethodLabel(transaction.paymentMethod)}
                </p>
              </div>

              {/* Usuário */}
              <div>
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Usuário</h3>
                </div>
                <p className="text-lg font-medium">
                  {transaction.username || 'N/A'}
                </p>
                {transaction.userId && (
                  <p className="text-sm text-text-secondary">
                    ID: {transaction.userId}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Data e Hora */}
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Data e Hora</h3>
                </div>
                <p className="font-medium">
                  Criada em: {formatDate(transaction.createdAt)}
                </p>
                <p className="text-sm text-text-secondary">
                  Última atualização: {formatDate(transaction.updatedAt)}
                </p>
              </div>

              {/* Informações de Contato */}
              <div>
                <div className="flex items-center mb-1">
                  <Phone className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Contato</h3>
                </div>
                <p className="font-medium">
                  Telefone: {transaction.telefone}
                </p>
                {transaction.cpfCnpj && (
                  <p className="text-sm text-text-secondary">
                    CPF/CNPJ: {transaction.cpfCnpj}
                  </p>
                )}
              </div>

              {/* Informações da Carteira */}
              <div>
                <div className="flex items-center mb-1">
                  <Bitcoin className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Carteira</h3>
                </div>
                <p className="text-sm font-mono break-all">
                  {transaction.coldWallet}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Rede: {transaction.network}
                </p>
              </div>
            </div>
          </div>

          {/* Cupom, se houver */}
          {transaction.cupom && (
            <div className="bg-background p-3 rounded-lg">
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-primary mr-2" />
                <h3 className="text-sm text-text-secondary">Cupom Aplicado</h3>
              </div>
              <p className="text-lg font-medium mt-1">{transaction.cupom}</p>
            </div>
          )}

          {/* QR Code, se houver */}
          {transaction.qrCodeUrl && (
            <div className="flex flex-col items-center bg-background p-4 rounded-lg">
              <h3 className="text-sm text-text-secondary mb-2">QR Code</h3>
              <img 
                src={transaction.qrCodeUrl} 
                alt="QR Code de pagamento" 
                className="w-48 h-48 object-contain"
              />
              {transaction.qrCodePaste && (
                <div className="mt-2 w-full">
                  <p className="text-sm text-text-secondary mb-1">Código Pix Copia e Cola:</p>
                  <div className="bg-gray-100 p-2 rounded-md">
                    <p className="text-xs font-mono break-all">{transaction.qrCodePaste}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg hover:bg-background transition-colors border border-surface"
            >
              Fechar
            </button>
            {onUpdateStatus && (
              <button
                onClick={onUpdateStatus}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Atualizar Status
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
