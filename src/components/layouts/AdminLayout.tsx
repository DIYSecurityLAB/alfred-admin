import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Tags, 
  Users, 
  Settings, 
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { Sidebar } from '../Sidebar';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Tags, label: 'Cupons', path: '/coupons' },
    { icon: CreditCard, label: 'Vendas', path: '/sales' },
    { icon: Users, label: 'Usuários', path: '/users' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="flex h-screen">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:static w-64 h-full z-40"
      >
        <Sidebar items={menuItems} />
      </motion.div>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}