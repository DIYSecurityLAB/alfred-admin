import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard';
import { Users } from '../../pages/Users';
import { AdminLayout } from '../layout/AdminLayout';
import { DefaultLayout } from '../layout/DefaultLayout';
import { Coupons } from '../screens/Coupons/Coupons';
import { Reports } from '../screens/Report/Report';
import { Settings } from '../screens/Settings/Settings';
import { BlockedUsers } from '../screens/Users/BlockedUser';
import { ROUTES } from './Routes';

export function BrowserRouter() {
  return (
    <DefaultLayout>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route
            path={ROUTES.home}
            element={<Navigate to={ROUTES.coupons} replace />}
          />
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route path={ROUTES.coupons} element={<Coupons />} />
          <Route path={ROUTES.sales} element={<Reports />} />
          <Route path={ROUTES.users.home} element={<Users />} />
          <Route path={ROUTES.users.blocked} element={<BlockedUsers />} />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>
      </Routes>
    </DefaultLayout>
  );
}
