import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function Container({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            when: 'beforeChildren',
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
