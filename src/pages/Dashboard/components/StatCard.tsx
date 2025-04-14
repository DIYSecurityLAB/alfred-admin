import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  iconBg?: string;
  iconColor?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  iconBg = 'bg-primary-light',
  iconColor = 'text-primary',
  delay = 0
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="bg-surface p-6 rounded-xl shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-secondary font-medium">{title}</h3>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <span className="text-2xl font-bold">{value}</span>
        
        {(change !== undefined && changeLabel) && (
          <div className="flex items-center">
            {change > 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : change < 0 ? (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            ) : null}
            
            <span className={`text-sm ${
              change > 0 ? 'text-green-500' : 
              change < 0 ? 'text-red-500' : 'text-text-secondary'
            }`}>
              {Math.abs(change).toFixed(1)}% {changeLabel}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
