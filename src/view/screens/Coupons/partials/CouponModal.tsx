import { Coupon } from '@/data/types/couponTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Calendar, Save, Tag, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema simplificado que aceita strings de data HTML
const couponSchema = z.object({
  code: z.string().min(3, 'Código deve ter no mínimo 3 caracteres'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0, 'Desconto deve ser maior que 0'),
  isActive: z.boolean(),
  validFrom: z.string().min(1, 'Data de início é obrigatória'),
  validUntil: z.string().optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponModalProps {
  coupon?: Coupon;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<any>;
}

export function CouponModal({ coupon, onClose, onSubmit }: CouponModalProps) {
  // Função para converter data ISO para formato HTML (YYYY-MM-DD)
  const formatDateForInput = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Função para converter data HTML para ISO 8601
  const formatDateForAPI = (htmlDate: string, isEndDate = false): string => {
    if (!htmlDate || htmlDate.trim() === '') return '';

    try {
      const date = new Date(htmlDate);
      if (isNaN(date.getTime())) return '';

      if (isEndDate) {
        // Para data final, usa 23:59:59
        date.setHours(23, 59, 59, 999);
      } else {
        // Para data inicial, usa 00:00:00
        date.setHours(0, 0, 0, 0);
      }

      return date.toISOString();
    } catch {
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon
      ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          isActive: coupon.isActive,
          validFrom: formatDateForInput(coupon.validFrom),
          validUntil: formatDateForInput(coupon.validUntil ?? undefined),
        }
      : {
          code: '',
          discountType: 'percentage',
          discountValue: 10,
          isActive: true,
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: '',
        },
  });

  const discountType = watch('discountType');

  // Função que transforma os dados antes de enviar
  const handleFormSubmit = async (data: CouponFormData) => {
    const transformedData = {
      code: data.code,
      discountType: data.discountType,
      discountValue: data.discountValue,
      isActive: data.isActive,
      validFrom: formatDateForAPI(data.validFrom, false),
      validUntil: data.validUntil
        ? formatDateForAPI(data.validUntil, true)
        : undefined,
    };

    // Remove campos undefined para não enviar dados desnecessários
    const cleanedData = Object.fromEntries(
      Object.entries(transformedData).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== undefined,
      ),
    );

    return onSubmit(cleanedData);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-gray-50 rounded-xl shadow-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Tag className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              {coupon ? 'Editar Cupom' : 'Novo Cupom'}
            </h2>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Código do Cupom
              </label>
              <input
                {...register('code')}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300/20 transition-colors"
                placeholder="Ex: VERAO2024"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Tipo de Desconto
                </label>
                <select
                  {...register('discountType')}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300/20 transition-colors"
                >
                  <option value="percentage">Porcentagem (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {discountType === 'percentage'
                    ? 'Desconto (%)'
                    : 'Desconto (R$)'}
                </label>
                <input
                  type="number"
                  step={discountType === 'percentage' ? '0.1' : '0.01'}
                  {...register('discountValue', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300/20 transition-colors"
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.discountValue.message}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="flex flex-col">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Válido a partir de
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                  <input
                    type="date"
                    {...register('validFrom')}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300/20 transition-colors"
                  />
                </div>
                {errors.validFrom && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.validFrom.message}
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Válido até (opcional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                  <input
                    type="date"
                    {...register('validUntil')}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-300/20 transition-colors"
                  />
                </div>
                {errors.validUntil && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.validUntil.message}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-2 mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="w-5 h-5 rounded text-blue-500 focus:ring-blue-300"
                />
                <label htmlFor="isActive" className="font-medium text-gray-800">
                  Cupom Ativo
                </label>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-end gap-4 pt-4 border-t border-gray-200"
            variants={itemVariants}
          >
            <motion.button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="h-5 w-5" />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
