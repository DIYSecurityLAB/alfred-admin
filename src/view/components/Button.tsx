import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

export type AddButtonProps = {
  icon: ReactNode;
  label: string;
  open: () => void;
};

export function Button({ open }: AddButtonProps) {
  return (
    <motion.button
      onClick={open}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Plus className="h-5 w-5" />
      Bloquear Usuário
    </motion.button>
  );
}
