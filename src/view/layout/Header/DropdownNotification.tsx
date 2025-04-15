import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import ClickOutside from "@/view/components/ClickOutside";

export function DropdownNotification() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black bg-white hover:text-blue-600"
        >
          <span
            className={`absolute -top-0.5 right-0 z-10 h-2 w-2 rounded-full bg-blue-600 ${
              notifying === false ? "hidden" : "inline"
            }`}
          >
            <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
          </span>

          <Bell size={18} />
        </Link>

        {dropdownOpen && (
          <div className="absolute -right-28 mt-3 w-80 rounded-md border border-black bg-white shadow-lg   sm:right-0">
            <div className="px-5 py-3 border-b border-black ">
              <h5 className="text-sm font-semibold text-black ">
                Notificações
              </h5>
            </div>

            <ul className="max-h-80 overflow-y-auto">
              <li>
                <Link
                  className="flex flex-col gap-2 border-t border-black px-5 py-4 hover:bg-blue-50  dark:hover:bg-white/10"
                  to="#"
                >
                  <div className="text-sm">
                    <span className="block text-black  font-semibold">
                      Notificação Teste
                    </span>
                    <span className="block text-black ">
                      Não implementado
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    17 Dez, 2024
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
}
