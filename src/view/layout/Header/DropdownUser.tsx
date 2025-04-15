import ClickOutside from "@/view/components/ClickOutside";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  User,
  Calendar,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors duration-200"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-semibold text-slate-800">
            DIY SEC LAB
          </span>
          <span className="block text-xs text-slate-500">ADMIN</span>
        </span>

        <div className="relative h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 bg-slate-50">
          <img
            src="https://www.alfredp2p.io/assets/_DIY%20SEC%20LAB%20-%20Apresenta%C3%A7%C3%A3o%20Comercial%20(1)-BVPxSjGj.png"
            alt="User"
            className="object-cover h-full w-full"
          />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border border-slate-150 bg-white shadow-lg z-50"
          >
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg overflow-hidden">
                  <img
                    src="https://www.alfredp2p.io/assets/_DIY%20SEC%20LAB%20-%20Apresenta%C3%A7%C3%A3o%20Comercial%20(1)-BVPxSjGj.png"
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-800">
                    DIY SEC LAB
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Shield size={12} className="text-blue-500" />
                    Administrator
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 py-2">
              <div className="grid grid-cols-2 gap-1 px-2">
                <div className="flex flex-col items-center rounded-md py-3 px-2 hover:bg-slate-100 transition-colors duration-200">
                  <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={16} />
                  </span>
                  <span className="mt-1 text-xs font-medium text-slate-700">
                    Perfil
                  </span>
                </div>
                <div className="flex flex-col items-center rounded-md py-3 px-2 hover:bg-slate-100 transition-colors duration-200">
                  <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Calendar size={16} />
                  </span>
                  <span className="mt-1 text-xs font-medium text-slate-700">
                    Contatos
                  </span>
                </div>
              </div>
            </div>

            <ul className="py-2 px-1">
              <li>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                >
                  <Settings size={18} className="text-slate-500" />
                  Configurações
                </Link>
              </li>
              <li>
                <button
                  className="w-full flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                  onClick={() => alert("Logout não implementado!")}
                >
                  <LogOut size={18} className="text-red-500" />
                  Sair
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </ClickOutside>
  );
};

export default DropdownUser;
