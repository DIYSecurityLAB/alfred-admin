import ClickOutside from "@/view/components/ClickOutside";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, Calendar, Settings, LogOut } from "lucide-react";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-semibold text-black ">
            DIY SEC LAB
          </span>
          <span className="block text-xs text-black/60">
            ADMIN
          </span>
        </span>

        <span className="h-12 w-12 rounded-full overflow-hidden flex justify-center items-center border border-black">
          <img
            src="https://www.alfredp2p.io/assets/_DIY%20SEC%20LAB%20-%20Apresenta%C3%A7%C3%A3o%20Comercial%20(1)-BVPxSjGj.png"
            alt="User"
            className="object-cover h-full w-full"
          />
        </span>

        <ChevronDown size={20} className="text-black " />
      </Link>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-64 flex-col rounded-md border border-black bg-white shadow-lg dark:border-white dark:bg-zinc-900">
          <ul className="flex flex-col gap-5 border-b border-black px-6 py-6 dark:border-white/20">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 text-sm font-medium text-black hover:text-blue-600 "
              >
                <User size={20} />
                Meu Perfil
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center gap-3 text-sm font-medium text-black hover:text-blue-600 "
              >
                <Calendar size={20} />
                Meus Contatos
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3 text-sm font-medium text-black hover:text-blue-600 "
              >
                <Settings size={20} />
                Configurações
              </Link>
            </li>
          </ul>
          <button className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-black hover:text-blue-600 ">
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
