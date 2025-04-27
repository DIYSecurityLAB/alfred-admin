import { Navigate, Route, Routes } from 'react-router-dom';
import { Permission } from '../../models/permissions';
import { AdminLayout } from '../layout/AdminLayout';
import { DashboardLayout } from '../layout/DashboardLayout';
import { DefaultLayout } from '../layout/DefaultLayout';
import { Coupons } from '../screens/Coupons/Coupons';
import { Login } from '../screens/Login';
import { DepositDetail } from '../screens/report/DepositDetail';
import { Reports } from '../screens/report/report';
import { SetPassword } from '../screens/SetPassword';
import { Settings } from '../screens/Settings/Settings';
import { UserManagement } from '../screens/userManagement/UserManagement';
import { BlockedUsers } from '../screens/Users/block/BlockedUser';
import { BlockedUserDetailsPage } from '../screens/Users/block/details/BlockedUserDetailsPage';
import { UserDetailsPage } from '../screens/Users/details/UserDetailsPage';
import { Users } from '../screens/Users/Users';
import { PermissionProtectedRoute } from './PermissionProtectedRoute';
import { PrivateRoute } from './PrivateRoute';
import { ROUTES } from './Routes';

export function BrowserRouter() {
  return (
    <DefaultLayout>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route
            path={'/dashboard'}
            element={
              <>
                <iframe
                  src="https://bi.diyseclab.io/Organization/37188f3c-9664-4559-8475-051ec3f2750e/App/215cfaff-d419-49bc-99fc-2a56c20b9a6c"
                  className="w-full h-[90vh]"
                ></iframe>
              </>
            }
          />
        </Route>

        <Route path={ROUTES.login} element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.setPassword} element={<SetPassword />} />

          <Route element={<AdminLayout />}>
            <Route
              path={ROUTES.home}
              element={<Navigate to={ROUTES.dashboard} replace />}
            />

            {/* Dashboard - acessível para todos os usuários autenticados */}
            <Route
              path={ROUTES.dashboard}
              element={
                <PermissionProtectedRoute
                  requiredPermissions={Permission.DASHBOARD_VIEW}
                >
                  <DashboardLayout />
                </PermissionProtectedRoute>
              }
            />

            {/* Cupons */}
            <Route
              element={
                <PermissionProtectedRoute
                  requiredPermissions={Permission.COUPONS_VIEW}
                />
              }
            >
              <Route path={ROUTES.coupons} element={<Coupons />} />
            </Route>

            {/* Vendas e Relatórios */}
            <Route
              element={
                <PermissionProtectedRoute
                  requiredPermissions={Permission.SALES_VIEW}
                />
              }
            >
              <Route path={ROUTES.sales.home} element={<Reports />} />
              <Route
                path={ROUTES.sales.details.path}
                element={<DepositDetail />}
              />
            </Route>

            {/* Usuários */}
            <Route
              element={
                <PermissionProtectedRoute
                  requiredPermissions={Permission.USERS_VIEW}
                />
              }
            >
              <Route path={ROUTES.users.home} element={<Users />} />
              <Route
                path={ROUTES.users.details.path}
                element={<UserDetailsPage />}
              />
            </Route>

            {/* Usuários Bloqueados - usando a permissão específica */}
            <Route
              element={
                <PermissionProtectedRoute
                  requiredPermissions={Permission.USERS_BLOCK_VIEW}
                />
              }
            >
              <Route
                path={ROUTES.users.blocked.home}
                element={<BlockedUsers />}
              />
              <Route
                path={ROUTES.users.blocked.details.path}
                element={<BlockedUserDetailsPage />}
              />
            </Route>

            {/* Configurações */}
            <Route
              element={
                <PermissionProtectedRoute
                  requiredPermissions={Permission.SETTINGS_VIEW}
                />
              }
            >
              <Route path={ROUTES.settings} element={<Settings />} />
            </Route>

            {/* Gerenciamento de Usuários do Sistema */}
            <Route
              element={
                <PermissionProtectedRoute
                  requiredPermissions={Permission.USER_MANAGEMENT_VIEW}
                />
              }
            >
              <Route
                path={ROUTES.userManagement}
                element={<UserManagement />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </DefaultLayout>
  );
}
