import React from 'react';
import { motion } from 'framer-motion';
import { X, Copy, CheckCircle, XCircle, Calendar, Tag, DollarSign, ShoppingBag, Users } from 'lucide-react';
import type { Coupon } from '../../../data/types';

interface CouponDetailsModalProps {
  coupon: Coupon;
  onClose: () => void;
  onEdit?: () => void;
}

export function CouponDetailsModal({ coupon, onClose, onEdit }: CouponDetailsModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Sem data definida";
    return new Date(dateString).toLocaleDateString();
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
          <h2 className="text-2xl font-bold">Detalhes do Cupom</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Código do Cupom com função de copiar */}
          <div className="bg-background p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-sm text-text-secondary">Código do Cupom</h3>
              </div>
              <button 
                onClick={handleCopyCode} 
                className="p-1.5 hover:bg-primary/10 rounded-md transition-colors"
                title="Copiar código"
              >
                {copied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-primary" />}
              </button>
            </div>
            <p className="text-xl font-medium mt-1 font-mono">{coupon.code}</p>
          </div>

          {/* Status */}
          <div className="flex items-center">
            {coupon.isActive ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span className={`text-lg font-medium ${coupon.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {coupon.isActive ? 'Cupom Ativo' : 'Cupom Inativo'}
            </span>
          </div>

          {/* Informações detalhadas do cupom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Desconto */}
              <div>
                <div className="flex items-center mb-1">
                  <DollarSign className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Desconto</h3>
                </div>
                <p className="text-lg font-medium">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `R$ ${coupon.discountValue.toFixed(2)}`}
                </p>
              </div>

              {/* Tipo de Desconto */}
              <div>
                <h3 className="text-sm text-text-secondary mb-1">Tipo de Desconto</h3>
                <p className="text-lg font-medium">
                  {coupon.discountType === 'percentage' ? 'Porcentagem' : 'Valor Fixo'}
                </p>
              </div>

              {/* Período de Validade */}
              <div>
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Período de Validade</h3>
                </div>
                <p className="font-medium">
                  De: {formatDate(coupon.validFrom)}
                </p>
                <p className="font-medium">
                  Até: {formatDate(coupon.validUntil)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Valor Mínimo de Compra */}
              <div>
                <div className="flex items-center mb-1">
                  <ShoppingBag className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Valor Mínimo de Compra</h3>
                </div>
                <p className="text-lg font-medium">
                  {coupon.minPurchaseValue > 0 
                    ? `R$ ${coupon.minPurchaseValue.toFixed(2)}`
                    : 'Sem valor mínimo'}
                </p>
              </div>

              {/* Valor Máximo de Desconto */}
              {coupon.discountType === 'percentage' && (
                <div>
                  <h3 className="text-sm text-text-secondary mb-1">Valor Máximo de Desconto</h3>
                  <p className="text-lg font-medium">
                    {coupon.maxDiscountValue > 0 
                      ? `R$ ${coupon.maxDiscountValue.toFixed(2)}`
                      : 'Ilimitado'}
                  </p>
                </div>
              )}

              {/* Limite de Uso */}
              <div>
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm text-text-secondary">Utilização</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </div>
                  <div className="w-full max-w-[120px] bg-background rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {coupon.usageLimit - coupon.usedCount} usos restantes
                </p>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg hover:bg-background transition-colors border border-surface"
            >
              Fechar
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}