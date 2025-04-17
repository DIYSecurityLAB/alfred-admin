import { Link } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { DropdownNotification } from "./DropdownNotification";
import { DropdownMessage } from "./DropdownMessage";
import DropdownUser from "./DropdownUser";
import { motion } from "framer-motion";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-sm border-b border-slate-100">
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="relative z-99999 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-colors duration-200"
          >
            <Menu size={22} />
          </button>
          <Link
            className="flex items-center flex-shrink-0 lg:hidden text-blue-900 font-bold text-lg transition-colors duration-200 hover:text-blue-700"
            to="/"
          >
            <div className="mr-2 h-8 w-8 rounded-lg bg-blue-900 flex items-center justify-center text-white">
              <span className="font-bold">A</span>
            </div>
            ALFRED P2P
          </Link>
        </div>

        <div className="hidden sm:block flex-grow max-w-xl mx-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Busca não implementada!");
            }}
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                <kbd className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-6">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DropdownNotification />
            <DropdownMessage />
          </ul>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DropdownUser />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
