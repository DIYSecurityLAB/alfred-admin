import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export type ButtonProps = {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
};

export function Button({ icon, label, onClick }: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      {label}
    </motion.button>
  );
}
