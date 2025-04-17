import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import ClickOutside from "@/view/components/ClickOutside";
import { motion, AnimatePresence } from "framer-motion";

export function DropdownNotification() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <button
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-colors duration-200"
        >
          <AnimatePresence>
            {notifying && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-0.5 right-0 h-2.5 w-2.5 rounded-full bg-red-500"
              >
                <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
              </motion.span>
            )}
          </AnimatePresence>

          <Bell size={20} className="text-slate-600" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute -right-28 mt-3 w-80 rounded-lg border border-slate-200 bg-white shadow-lg sm:right-0 z-50"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h5 className="text-sm font-semibold text-slate-800">
                  Notificações
                </h5>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                  3
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <div className="p-1">
                  {/* Notification items */}
                  <Link
                    className="flex flex-col gap-2 px-5 py-4 rounded-md hover:bg-slate-50 transition-colors duration-200"
                    to="#"
                  >
                    <div className="flex items-center">
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Bell size={16} />
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-800">
                          Atualização do Sistema
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Nova versão disponível
                        </p>
                      </div>
                      <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      17 Abr, 2025 • 10:30
                    </span>
                  </Link>
                  
                  <Link
                    className="flex flex-col gap-2 px-5 py-4 rounded-md hover:bg-slate-50 transition-colors duration-200"
                    to="#"
                  >
                    <div className="flex items-center">
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <Bell size={16} />
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-800">
                          Novo Usuário
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Carlos Silva registrou-se
                        </p>
                      </div>
                      <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      17 Abr, 2025 • 09:45
                    </span>
                  </Link>
                  
                  <Link
                    className="flex flex-col gap-2 px-5 py-4 rounded-md hover:bg-slate-50 transition-colors duration-200"
                    to="#"
                  >
                    <div className="flex items-center">
                      <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                        <Bell size={16} />
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-800">
                          Alerta de Segurança
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Verificação necessária
                        </p>
                      </div>
                      <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      16 Abr, 2025 • 18:20
                    </span>
                  </Link>
                </div>
              </div>
              
              <div className="border-t border-slate-100 p-2">
                <Link
                  to="#"
                  className="block text-center py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                >
                  Ver todas as notificações
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </ClickOutside>
  );
}