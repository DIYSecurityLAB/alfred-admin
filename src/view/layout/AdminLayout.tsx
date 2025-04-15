import {
  LayoutDashboard,
  Tags,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import { Sidebar, SidebarItems } from "./Sidebar/Sidebar";

const menuItems: SidebarItems = [
  {
    type: "link",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  { type: "link", icon: Tags, label: "Cupons", path: "/coupons" },
  { type: "link", icon: CreditCard, label: "Vendas", path: "/sales" },
  { type: "link", icon: Users, label: "Usuários", path: "/users" },
  { type: "link", icon: Settings, label: "Configurações", path: "/settings" },
  // {
  //   type: "dropdown",
  //   icon: <CiMail />,
  //   label: "Newsletter",
  //   activeCondition: pathname.includes("newsletter"),
  //   dropItems: [
  //     {
  //       path: ROUTES.newsletter.listAll.call(),
  //       label: "Listar Todos",
  //     },
  //   ],
  // },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          items={menuItems}
        />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
