import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '../../contexts/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { LockedFeatureMessage } from '../components/LockedFeatureMessage';
import { ROUTES } from './Routes';

interface RoleProtectedRouteProps {
  requiredRole: UserRole | UserRole[];
  redirectTo?: string;
  showLocked?: boolean;
}

export function RoleProtectedRoute({
  requiredRole,
  redirectTo = ROUTES.login,
  showLocked = true,
}: RoleProtectedRouteProps) {
  const { hasRole, currentUser, loading } = useAuth();

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

  const hasRequiredRole = hasRole(requiredRole);

  if (!hasRequiredRole && showLocked) {
    return <LockedFeatureMessage requiredRole={requiredRole} />;
  }

  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
