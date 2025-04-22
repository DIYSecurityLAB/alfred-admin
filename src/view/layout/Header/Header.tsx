import { motion } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import { DropdownMessage } from './DropdownMessage';
import { DropdownNotification } from './DropdownNotification';
import DropdownUser from './DropdownUser';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-[800] flex w-full bg-white drop-shadow-sm border-b border-slate-100">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 lg:px-8 2xl:px-12">
        <div className="flex items-center gap-3 md:gap-4 lg:hidden">
          <button
            title="Toggle Sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="relative z-50 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-colors duration-200"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="hidden sm:block flex-grow max-w-2xl mx-6 lg:mx-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Busca não implementada!');
            }}
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full h-12 pl-12 pr-16 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-base"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <ul className="flex items-center gap-3 md:gap-5">
            <DropdownNotification />
            <DropdownMessage />
          </ul>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="ml-1"
          >
            <DropdownUser />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
