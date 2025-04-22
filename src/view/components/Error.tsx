import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

type ErrorProps = {
  error: string | null;
  clear: () => void;
};

export function Error({ clear, error }: ErrorProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 shadow-sm"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { type: 'spring', stiffness: 100 },
            },
            exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button
            title="Fechar"
            onClick={clear}
            className="ml-auto text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
