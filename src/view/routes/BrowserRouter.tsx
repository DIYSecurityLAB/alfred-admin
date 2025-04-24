import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../layout/AdminLayout';
import { DashboardLayout } from '../layout/DashboardLayout';
import { DefaultLayout } from '../layout/DefaultLayout';
import { Coupons } from '../screens/Coupons/Coupons';
import { DepositDetail } from '../screens/report/DepositDetail';
import { Reports } from '../screens/report/report';
import { Settings } from '../screens/Settings/Settings';
import { BlockedUsers } from '../screens/Users/block/BlockedUser';
import { BlockedUserDetailsPage } from '../screens/Users/block/details/BlockedUserDetailsPage';
import { UserDetailsPage } from '../screens/Users/details/UserDetailsPage';
import { Users } from '../screens/Users/Users';
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

        <Route element={<AdminLayout />}>
          <Route
            path={ROUTES.home}
            element={<Navigate to={ROUTES.coupons} replace />}
          />

          <Route path={ROUTES.coupons} element={<Coupons />} />
          <Route path={ROUTES.sales.home} element={<Reports />} />
          <Route path={ROUTES.sales.details.path} element={<DepositDetail />} />
          <Route path={ROUTES.users.blocked.home} element={<BlockedUsers />} />
          <Route
            path={ROUTES.users.blocked.details.path}
            element={<BlockedUserDetailsPage />}
          />
          <Route path={ROUTES.users.home} element={<Users />} />
          <Route
            path={ROUTES.users.details.path}
            element={<UserDetailsPage />}
          />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>
      </Routes>
    </DefaultLayout>
  );
}
