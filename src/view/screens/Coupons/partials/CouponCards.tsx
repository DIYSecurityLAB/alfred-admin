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
  ShoppingBag,
} from "lucide-react";
import type { Coupon } from "../../../../data/types";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {coupons.map((coupon) => (
        <motion.div
          key={coupon.id}
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="p-5 bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="bg-blue-50 p-2 rounded-full mr-3">
                <Tag className="text-blue-500 h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">{coupon.code}</h3>
            </div>
            <span
              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${
                coupon.isActive
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {coupon.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                {coupon.discountType === "percentage" ? (
                  <Percent className="h-4 w-4 mr-1 text-blue-500" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-1 text-blue-500" />
                )}
                Desconto:
              </span>
              <span
                className={`font-medium ${
                  coupon.discountType === "percentage"
                    ? "text-blue-500"
                    : "text-blue-500"
                }`}
              >
                {coupon.discountType === "percentage"
                  ? `${coupon.discountValue}%`
                  : `R$ ${coupon.discountValue.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <ShoppingBag className="h-4 w-4 mr-1 text-blue-500" />
                Uso:
              </span>
              <div className="flex items-center">
                <span className="font-medium">{coupon.usedCount}</span>
                <span className="mx-1 text-gray-400">/</span>
                <span>{coupon.usageLimit}</span>
                <div className="ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
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
              <span className="text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                Validade:
              </span>
              <span className="text-gray-700">
                {formatDate(coupon.validUntil)}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <motion.button
              onClick={() => onViewDetails(coupon)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-500 hover:text-blue-600 shadow-sm"
              title="Ver detalhes"
            >
              <Eye className="h-5 w-5" />
            </motion.button>

            <motion.button
              onClick={() => onEdit(coupon)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-amber-500 hover:text-amber-600 shadow-sm"
              title="Editar"
            >
              <Edit className="h-5 w-5" />
            </motion.button>

            <motion.button
              onClick={() => onToggleStatus(coupon.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors shadow-sm ${
                coupon.isActive
                  ? "bg-green-50 hover:bg-red-50 text-green-500 hover:text-red-500"
                  : "bg-red-50 hover:bg-green-50 text-red-500 hover:text-green-500"
              }`}
              title={coupon.isActive ? "Desativar" : "Ativar"}
            >
              {coupon.isActive ? (
                <ToggleRight className="h-5 w-5" />
              ) : (
                <ToggleLeft className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
