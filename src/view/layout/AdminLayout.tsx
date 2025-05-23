import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import { Sidebar } from './Sidebar/Sidebar';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
