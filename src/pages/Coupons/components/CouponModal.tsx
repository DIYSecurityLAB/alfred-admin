import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { Coupon } from '../../../data/types';

const couponSchema = z.object({
  code: z.string().min(3, 'Código deve ter no mínimo 3 caracteres'),
  discountType: z.enum(['percentage', 'fixed']),  // Alterado para discountType
  discountValue: z.number().min(0, 'Desconto deve ser maior que 0'),
  minPurchaseValue: z.number().min(0, 'Valor mínimo deve ser maior ou igual a 0'),
  maxDiscountValue: z.number().min(0, 'Valor máximo de desconto deve ser maior ou igual a 0'),
  usageLimit: z.number().min(1, 'Limite de uso deve ser maior que 0'),
  isActive: z.boolean(),
  validFrom: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Data de início inválida',
  }),
  validUntil: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Data de validade inválida',
  }),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponModalProps {
  coupon?: Coupon;
  onClose: () => void;
  onSubmit: (data: CouponFormData) => Promise<any>;
}

export function CouponModal({ coupon, onClose, onSubmit }: CouponModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon
      ? {
          ...coupon,
          validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
          validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        }
      : {
          discountType: 'percentage',
          discountValue: 10,
          minPurchaseValue: 0,
          maxDiscountValue: 0,
          usageLimit: 100,
          isActive: true,
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        },
  });

  // Campo de seleção de tipo de desconto agora usa o nome correto "discountType"
  const discountType = watch('discountType');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {coupon ? 'Editar Cupom' : 'Novo Cupom'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Código do Cupom</label>
              <input
                {...register('code')}
                className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                placeholder="Ex: VERAO2024"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Desconto</label>
                <select
                  {...register('discountType')}
                  className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                >
                  <option value="percentage">Porcentagem (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {discountType === 'percentage' ? 'Desconto (%)' : 'Desconto (R$)'}
                </label>
                <input
                  type="number"
                  step={discountType === 'percentage' ? '0.1' : '0.01'} 
                  {...register('discountValue', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-sm mt-1">{errors.discountValue.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Valor Mínimo da Compra (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('minPurchaseValue', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                />
                {errors.minPurchaseValue && (
                  <p className="text-red-500 text-sm mt-1">{errors.minPurchaseValue.message}</p>
                )}
              </div>

              {discountType === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Valor Máximo de Desconto (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('maxDiscountValue', { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                  />
                  {errors.maxDiscountValue && (
                    <p className="text-red-500 text-sm mt-1">{errors.maxDiscountValue.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Válido a partir de</label>
                <input
                  type="date"
                  {...register('validFrom')}
                  className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                />
                {errors.validFrom && (
                  <p className="text-red-500 text-sm mt-1">{errors.validFrom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Válido até</label>
                <input
                  type="date"
                  {...register('validUntil')}
                  className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                />
                {errors.validUntil && (
                  <p className="text-red-500 text-sm mt-1">{errors.validUntil.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Limite de Uso</label>
                <input
                  type="number"
                  {...register('usageLimit', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                />
                {errors.usageLimit && (
                  <p className="text-red-500 text-sm mt-1">{errors.usageLimit.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-7">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="w-5 h-5 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="font-medium">
                  Cupom Ativo
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg hover:bg-background transition-colors border border-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}