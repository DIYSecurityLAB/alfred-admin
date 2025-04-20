import { motion } from 'framer-motion';
import { AlertTriangle, Loader, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { Coupon } from '../../../../data/types';

interface DeleteConfirmModalProps {
  coupon: Coupon;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: () => Promise<any>;
}

export function DeleteConfirmModal({
  coupon,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white rounded-lg shadow-md border border-gray-100 p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600 flex items-center">
            <Trash2 className="h-5 w-5 mr-2" />
            Excluir Cupom
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Fechar"
            disabled={isDeleting}
          >
            <X className="h-5 w-5 text-gray-600 hover:text-red-600" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center text-center mb-6 py-2"
        >
          <div className="bg-red-50 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Tem certeza que deseja excluir este cupom?
          </h3>
          <p className="text-gray-600">
            Você está prestes a excluir o cupom <strong>{coupon.code}</strong>.
            Esta ação não pode ser desfeita.
          </p>
        </motion.div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <motion.button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-gray-700"
            disabled={isDeleting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm hover:shadow flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {isDeleting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                <span>Excluir</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
