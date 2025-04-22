import { motion } from 'framer-motion';
import { ShieldX } from 'lucide-react';
import { ReactNode } from 'react';

export function PageHeader({
  title,
  button,
  collapsed,
  description,
  toggle,
}: {
  title: string;
  button?: ReactNode;
  collapsed: boolean;
  description: string;
  toggle: () => void;
}) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md border border-blue-50 p-3 sm:p-4 md:p-6 mb-4 w-full overflow-hidden relative z-0"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 100 },
        },
      }}
      onClick={collapsed ? toggle : undefined}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
        <div className="flex items-start sm:items-center w-full sm:w-auto">
          <ShieldX className="h-5 w-5 md:h-6 md:w-6 text-blue-500 mr-2 md:mr-3 flex-shrink-0 mt-1 sm:mt-0" />
          <div className="flex-1 min-w-0 w-full">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 text-gray-800 truncate">
              {title}
            </h1>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-2 sm:line-clamp-none">
                  {description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
        {button && (
          <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end">
            {button}
          </div>
        )}
      </div>
    </motion.div>
  );
}
