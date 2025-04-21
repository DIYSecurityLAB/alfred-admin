import { motion } from 'framer-motion';
import { ShieldX } from 'lucide-react';
import { ReactNode, useState } from 'react';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export function PageHeader({
  title,
  description,
  button,
}: {
  title: string;
  description: string;
  button: ReactNode;
}) {
  const [collapsedHeader, setCollapsedHeader] = useState(false);

  const toggleHeader = () => {
    setCollapsedHeader(!collapsedHeader);
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md border border-blue-50 p-6 mb-8 transition-all duration-500 ${
        collapsedHeader ? 'cursor-pointer' : ''
      }`}
      variants={itemVariants}
      onClick={collapsedHeader ? toggleHeader : undefined}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <ShieldX className="h-6 w-6 text-blue-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{title}</h1>
            {!collapsedHeader && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-gray-600">{description}</p>
              </motion.div>
            )}
          </div>
        </div>
        {button && button}
      </div>
    </motion.div>
  );
}
