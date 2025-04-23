import { CreditCard, Settings, Tags, UserX } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ROUTES } from '../routes/Routes';
import Header from './Header/Header';
import { Sidebar, SidebarItems } from './Sidebar/Sidebar';

const menuItems: SidebarItems = [
  { type: 'link', icon: Tags, label: 'Cupons', path: ROUTES.coupons },
  { type: 'link', icon: CreditCard, label: 'Vendas', path: ROUTES.sales.home },
  {
    type: 'link',
    icon: UserX,
    label: 'Usuários Bloqueados',
    path: ROUTES.users.blocked.home,
  },
  {
    type: 'link',
    icon: Settings,
    label: 'Configurações',
    path: ROUTES.settings,
  },
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
