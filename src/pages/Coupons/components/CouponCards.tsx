import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Tag,
  Percent,
  DollarSign,
} from "lucide-react";
import type { Coupon } from "../../../data/types";

interface CouponCardsProps {
  coupons: Coupon[];
  onViewDetails: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onToggleStatus: (id: string) => Promise<any>;
}

export function CouponCards({
  coupons,
  onViewDetails,
  onEdit,
  onToggleStatus,
}: CouponCardsProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {coupons.map((coupon, index) => (
        <motion.div
          key={coupon.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="p-5 bg-gray-100 rounded-lg border border-gray-100/30 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="bg-gray-50/10 p-2 rounded-full mr-3">
                <Tag className="text-red h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">{coupon.code}</h3>
            </div>
            <span
              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${
                coupon.isActive
                  ? "bg-green-700/20 text-green-400 border border-green-800"
                  : "bg-red-/20 text-red-400 border border-red-800"
              }`}
            >
              {coupon.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                {coupon.discountType === "percentage" ? (
                  <Percent className="h-4 w-4 mr-1 text-emerald-500" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                )}
                Desconto:
              </span>
              <span
                className={`font-medium ${
                  coupon.discountType === "percentage"
                    ? "text-emerald-500"
                    : "text-blue-500"
                }`}
              >
                {coupon.discountType === "percentage"
                  ? `${coupon.discountValue}%`
                  : `R$ ${coupon.discountValue.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Uso:</span>
              <div className="flex items-center">
                <span className="font-medium">{coupon.usedCount}</span>
                <span className="mx-1 text-text-secondary/50">/</span>
                <span>{coupon.usageLimit}</span>
                <div className="ml-2 w-16 h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-50 rounded-full"
                    style={{
                      width: `${Math.min(
                        (coupon.usedCount / (coupon.usageLimit ?? 10000)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                Validade:
              </span>
              <span>{formatDate(coupon.validUntil)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100/30">
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
                  ? "hover:bg-red-700/20 text-green-400 hover:text-red-400"
                  : "hover:bg-green-700/20 text-red-400 hover:text-green-400"
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
        </motion.div>
      ))}
    </div>
  );
}
