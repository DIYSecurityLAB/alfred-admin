import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Permission } from '../../models/permissions';
import { LockedFeatureMessage } from '../components/LockedFeatureMessage';
import { ROUTES } from './Routes';

interface PermissionProtectedRouteProps {
  requiredPermissions: Permission | Permission[];
  redirectTo?: string;
  showLocked?: boolean;
  children?: ReactNode;
}

export function PermissionProtectedRoute({
  requiredPermissions,
  redirectTo = ROUTES.login,
  showLocked = true,
  children,
}: PermissionProtectedRouteProps) {
  const { hasAnyPermission, currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verificar todas as permissões necessárias
  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  const hasAccess = hasAnyPermission(permissions);

  if (!hasAccess && showLocked) {
    return <LockedFeatureMessage requiredPermissions={requiredPermissions} />;
  }

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  // Renderizar children se fornecido, caso contrário, renderizar Outlet
  return children ? <>{children}</> : <Outlet />;
}
