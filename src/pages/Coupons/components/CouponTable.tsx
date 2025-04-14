import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Coupon } from '../../../data/types';

interface CouponTableProps {
  coupons: Coupon[];
  onViewDetails: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  onToggleStatus: (id: string) => Promise<any>;
}

export function CouponTable({
  coupons,
  onViewDetails,
  onEdit,
  onToggleStatus,
}: CouponTableProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-background border-b border-surface">
            <th className="py-3 px-4 font-medium text-text-secondary">Código</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Desconto</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Usado</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Validade</th>
            <th className="py-3 px-4 font-medium text-text-secondary">Status</th>
            <th className="py-3 px-4 font-medium text-text-secondary text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon, index) => (
            <motion.tr
              key={coupon.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`border-b border-surface ${index % 2 === 0 ? 'bg-surface' : 'bg-background'} hover:bg-primary/5 transition-colors`}
            >
              <td className="py-4 px-4 font-medium text-primary">{coupon.code}</td>
              <td className="py-4 px-4">
                <span className="font-medium">
                  {coupon.discountType === 'percentage' 
                    ? <span className="text-emerald-500">{coupon.discountValue}%</span>
                    : <span className="text-blue-500">R$ {coupon.discountValue.toFixed(2)}</span>}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center">
                  <span className="font-medium">{coupon.usedCount}</span>
                  <span className="text-text-secondary mx-1">/</span>
                  <span>{coupon.usageLimit}</span>
                </span>
              </td>
              <td className="py-4 px-4 text-text-secondary">
                {formatDate(coupon.validUntil)}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    coupon.isActive
                      ? 'bg-green-900/20 text-green-400 border border-green-800'
                      : 'bg-red-900/20 text-red-400 border border-red-800'
                  }`}
                >
                  {coupon.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="inline-flex items-center space-x-1">
                  <button
                    onClick={() => onViewDetails(coupon)}
                    className="p-2 hover:bg-blue-900/20 rounded-full transition-colors text-blue-400 hover:text-blue-300"
                    title="Ver detalhes"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(coupon)}
                    className="p-2 hover:bg-amber-900/20 rounded-full transition-colors text-amber-400 hover:text-amber-300"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onToggleStatus(coupon.id)}
                    className={`p-2 rounded-full transition-colors ${
                      coupon.isActive
                        ? 'hover:bg-red-900/20 text-green-400 hover:text-red-400'
                        : 'hover:bg-green-900/20 text-red-400 hover:text-green-400'
                    }`}
                    title={coupon.isActive ? "Desativar" : "Ativar"}
                  >
                    {coupon.isActive ? (
                      <ToggleRight className="h-5 w-5" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
