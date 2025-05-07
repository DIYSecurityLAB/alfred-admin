import { motion } from 'framer-motion';
import { Edit, Eye, Lock, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Coupon } from '../../../../data/types';

interface CouponTableProps {
  coupons: Coupon[];
  onViewDetails: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onToggleStatus: (id: string) => Promise<any>;
  canEdit?: boolean;
}

export function CouponTable({
  coupons,
  onViewDetails,
  onEdit,
  onToggleStatus,
  canEdit = false,
}: CouponTableProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="overflow-x-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 font-medium text-gray-600">Código</th>
              <th className="py-3 px-4 font-medium text-gray-600">Desconto</th>
              <th className="py-3 px-4 font-medium text-gray-600">Usado</th>
              <th className="py-3 px-4 font-medium text-gray-600">Validade</th>
              <th className="py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="py-3 px-4 font-medium text-gray-600 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, index) => (
              <motion.tr
                key={coupon.id}
                variants={rowVariants}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors`}
                whileHover={{ scale: 1.01, x: 5 }}
              >
                <td className="py-4 px-4 font-medium text-blue-500">
                  {coupon.code}
                </td>
                <td className="py-4 px-4">
                  <span className="font-medium">
                    {coupon.discountType === 'percentage' ? (
                      <span className="text-emerald-500">
                        {coupon.discountValue}%
                      </span>
                    ) : (
                      <span className="text-blue-500">
                        R$ {coupon.discountValue.toFixed(2)}
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center">
                    <span className="font-medium">{coupon.usedCount}</span>
                    <span className="text-gray-500 mx-1">/</span>
                    <span>{coupon.usageLimit}</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {formatDate(coupon.validUntil)}
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      coupon.isActive
                        ? 'bg-green-100 text-green-600 border border-green-200'
                        : 'bg-red-100 text-red-600 border border-red-200'
                    }`}
                  >
                    {coupon.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex items-center space-x-1">
                    <motion.button
                      onClick={() => onViewDetails(coupon)}
                      className="p-2 hover:bg-blue-100 rounded-full transition-colors text-blue-500 hover:text-blue-600"
                      title="Ver detalhes"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="h-5 w-5" />
                    </motion.button>

                    {canEdit ? (
                      <>
                        <motion.button
                          onClick={() => onEdit(coupon)}
                          className="p-2 hover:bg-amber-50 rounded-full transition-colors text-amber-500 hover:text-amber-600"
                          title="Editar"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => onToggleStatus(coupon.id)}
                          className={`p-2 rounded-full transition-colors ${
                            coupon.isActive
                              ? 'hover:bg-red-50 text-green-500 hover:text-red-500'
                              : 'hover:bg-green-50 text-red-500 hover:text-green-500'
                          }`}
                          title={coupon.isActive ? 'Desativar' : 'Ativar'}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {coupon.isActive ? (
                            <ToggleRight className="h-5 w-5" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </motion.button>
                      </>
                    ) : (
                      <span
                        className="p-2 text-gray-400"
                        title="Acesso restrito"
                      >
                        <Lock className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
