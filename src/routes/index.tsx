import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Dashboard } from '../pages/Dashboard';
import { Coupons } from '../pages/Coupons';
import { Reports } from '../pages/Reports';
import { Users } from '../pages/Users';
import { Settings } from '../pages/Settings';
//import { Login } from '../pages/Login';
//import { PrivateRoute } from './PrivateRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública - Login temporariamente mostrando Coupons */}
      <Route path="/login" element={<Coupons />} />
      
      {/* Rotas administrativas */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/coupons" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coupons/*" element={<Coupons />} />
        <Route path="/sales/*" element={<Reports />} />
        <Route path="/users/*" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}