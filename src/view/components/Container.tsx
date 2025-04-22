import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function Container({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="container mx-auto px-4 py-4 sm:py-6 md:py-8 w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl"
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
