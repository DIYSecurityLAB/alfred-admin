import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard';
import { Users } from '../../pages/Users';
import { AdminLayout } from '../layout/AdminLayout';
import { DefaultLayout } from '../layout/DefaultLayout';
import { Coupons } from '../screens/Coupons/Coupons';
import { DepositDetail } from '../screens/report/DepositDetail';
import { Report } from '../screens/report/Report';
import { Settings } from '../screens/Settings/Settings';
import { BlockedUsers } from '../screens/Users/block/BlockedUser';
import { BlockedUserDetailsPage } from '../screens/Users/block/details/BlockedUserDetailsPage';
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
          <Route path={ROUTES.sales.home} element={<Report />} />
          <Route path={ROUTES.sales.details.path} element={<DepositDetail />} />
          <Route path={ROUTES.users.home} element={<Users />} />
          <Route path={ROUTES.users.blocked.home} element={<BlockedUsers />} />
          <Route
            path={ROUTES.users.blocked.details.path}
            element={<BlockedUserDetailsPage />}
          />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>
      </Routes>
    </DefaultLayout>
  );
}
