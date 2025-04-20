import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../layout/AdminLayout";
import { Dashboard } from "../../pages/Dashboard";
import { Reports } from "../screens/Report/Report";
import { Users } from "../../pages/Users";
import { Settings } from "../screens/Settings/Settings";
import { DefaultLayout } from "../layout/DefaultLayout";
import { ROUTES } from "./Routes";
import { Coupons } from "../screens/Coupons/Coupons";
import { BlockedUsers } from "../screens/Users/BlockedUser";

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
