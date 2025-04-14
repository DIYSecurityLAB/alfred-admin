import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  items: {
    icon: LucideIcon;
    label: string;
    path: string;
  }[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <div className="h-full bg-surface p-4 shadow-lg">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                'hover:bg-primary/10',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-white' : 'text-text-secondary'
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute left-0 w-1 h-full bg-primary"
                    layoutId="activeIndicator"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}