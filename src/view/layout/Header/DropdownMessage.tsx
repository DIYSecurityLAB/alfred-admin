import ClickOutside from '@/view/components/ClickOutside';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function DropdownMessage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="relative">
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
                className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500"
              >
                <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              </motion.span>
            )}
          </AnimatePresence>

          <MessageCircle size={20} className="text-slate-600" />
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
                  Mensagens
                </h5>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                  2
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <div className="p-1">
                  {/* Message items */}
                  <Link
                    className="flex items-center gap-3 px-5 py-3 rounded-md hover:bg-slate-50 transition-colors duration-200"
                    to="/messages"
                  >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src="https://www.alfredp2p.io/faviconai.png"
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h6 className="text-sm font-semibold text-slate-800 truncate">
                          Ana Silva
                        </h6>
                        <p className="text-xs text-slate-400 whitespace-nowrap ml-2">
                          10min
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        Preciso discutir uma nova implementação...
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                  </Link>

                  <Link
                    className="flex items-center gap-3 px-5 py-3 rounded-md hover:bg-slate-50 transition-colors duration-200"
                    to="/messages"
                  >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        RL
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-400 border-2 border-white"></span>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h6 className="text-sm font-semibold text-slate-800 truncate">
                          Roberto Lima
                        </h6>
                        <p className="text-xs text-slate-400 whitespace-nowrap ml-2">
                          1h
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        Os resultados do teste estão prontos para...
                      </p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                  </Link>

                  <Link
                    className="flex items-center gap-3 px-5 py-3 rounded-md hover:bg-slate-50 transition-colors duration-200"
                    to="/messages"
                  >
                    <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full w-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        JM
                      </div>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h6 className="text-sm font-semibold text-slate-800 truncate">
                          João Mendes
                        </h6>
                        <p className="text-xs text-slate-400 whitespace-nowrap ml-2">
                          Ontem
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        Vamos revisar o relatório de segurança...
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-100 p-2">
                <Link
                  to="/messages"
                  className="block text-center py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                >
                  Ver todas as mensagens
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    </ClickOutside>
  );
}
