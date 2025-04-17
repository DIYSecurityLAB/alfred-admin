import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  DollarSign,
  ShoppingBag,
  Users,
  Edit,
  Percent,
  Info,
} from "lucide-react";
import type { Coupon } from "../../../../data/types";
import { useState } from "react";

interface CouponDetailsModalProps {
  coupon: Coupon;
  onClose: () => void;
  onEdit?: () => void;
}

export function CouponDetailsModal({
  coupon,
  onClose,
  onEdit,
}: CouponDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Sem data definida";
    return new Date(dateString).toLocaleDateString();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Info className="h-6 w-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                Detalhes do Cupom
              </h2>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, backgroundColor: "#F9FAFB" }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div
              variants={itemVariants}
              className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-sm text-gray-600">Código do Cupom</h3>
                </div>
                <motion.button
                  onClick={handleCopyCode}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 hover:bg-blue-100/80 rounded-md transition-colors"
                  title="Copiar código"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-blue-500" />
                  )}
                </motion.button>
              </div>
              <p className="text-xl font-medium mt-1 font-mono">
                {coupon.code}
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex items-center p-3 rounded-lg bg-gray-50"
            >
              {coupon.isActive ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span
                className={`text-lg font-medium ${
                  coupon.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {coupon.isActive ? "Cupom Ativo" : "Cupom Inativo"}
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center mb-1">
                    {coupon.discountType === "percentage" ? (
                      <Percent className="h-4 w-4 text-blue-500 mr-2" />
                    ) : (
                      <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                    )}
                    <h3 className="text-sm text-gray-600">Desconto</h3>
                  </div>
                  <p className="text-lg font-medium text-blue-600">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `R$ ${coupon.discountValue.toFixed(2)}`}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
                >
                  <h3 className="text-sm text-gray-600 mb-1">
                    Tipo de Desconto
                  </h3>
                  <p className="text-lg font-medium text-gray-800">
                    {coupon.discountType === "percentage"
                      ? "Porcentagem"
                      : "Valor Fixo"}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-600">
                      Período de Validade
                    </h3>
                  </div>
                  <p className="font-medium text-gray-800">
                    <span className="text-sm text-gray-500">De:</span>{" "}
                    {formatDate(coupon.validFrom)}
                  </p>
                  <p className="font-medium text-gray-800">
                    <span className="text-sm text-gray-500">Até:</span>{" "}
                    {formatDate(coupon.validUntil)}
                  </p>
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center mb-1">
                    <ShoppingBag className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-600">
                      Valor Mínimo de Compra
                    </h3>
                  </div>
                  <p className="text-lg font-medium text-gray-800">
                    {(coupon.minPurchaseValue ?? 0) > 0
                      ? `R$ ${(coupon.minPurchaseValue ?? 0).toFixed(2)}`
                      : "Sem valor mínimo"}
                  </p>
                </motion.div>
                {coupon.discountType === "percentage" && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
                  >
                    <h3 className="text-sm text-gray-600 mb-1">
                      Valor Máximo de Desconto
                    </h3>
                    <p className="text-lg font-medium text-gray-800">
                      {(coupon.maxDiscountValue ?? 0) > 0
                        ? `R$ ${(coupon.maxDiscountValue ?? 0).toFixed(2)}`
                        : "Ilimitado"}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 text-blue-500 mr-2" />
                    <h3 className="text-sm text-gray-600">Utilização</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-medium text-gray-800">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </div>
                    <div className="w-full max-w-[120px] bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            (coupon.usedCount / (coupon.usageLimit ?? 10000)) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {(coupon.usageLimit ?? 10000) - coupon.usedCount} usos
                    restantes
                  </p>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex justify-end gap-4 pt-4 border-t border-gray-200"
            >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
              >
                Fechar
              </motion.button>
              {onEdit && (
                <motion.button
                  onClick={onEdit}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
