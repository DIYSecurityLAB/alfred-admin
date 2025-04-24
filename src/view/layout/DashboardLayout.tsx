import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import { Sidebar } from './Sidebar/Sidebar';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
