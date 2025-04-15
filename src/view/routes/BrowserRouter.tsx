import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../layout/AdminLayout";
import { Dashboard } from "../../pages/Dashboard";
import { Coupons } from "../../pages/Coupons";
import { Reports } from "../../pages/Reports";
import { Users } from "../../pages/Users";
import { Settings } from "../../pages/Settings";
import { DefaultLayout } from "../layout/DefaultLayout";
import { ROUTES } from "./Routes";

export function BrowserRouter() {
  return (
    <DefaultLayout>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.home} element={<Navigate to={ROUTES.coupons} replace />} />
          <Route path={ROUTES.dashboard} element={<Dashboard />} />
          <Route path={ROUTES.coupons} element={<Coupons />} />
          <Route path={ROUTES.sales} element={<Reports />} />
          <Route path={ROUTES.users} element={<Users />} />
          <Route path={ROUTES.settings} element={<Settings />} />
        </Route>
      </Routes>
    </DefaultLayout>
  );
}
