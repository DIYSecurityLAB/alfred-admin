import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import ClickOutside from "@/view/components/ClickOutside";

export function DropdownMessage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li className="relative">
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black bg-white hover:text-blue-600  "
          to="#"
        >
          <span
            className={`absolute -top-0.5 -right-0.5 z-10 h-2 w-2 rounded-full bg-blue-600 ${
              notifying === false ? "hidden" : "inline"
            }`}
          >
            <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-75"></span>
          </span>

          <MessageCircle size={18} />
        </Link>

        {dropdownOpen && (
          <div className="absolute -right-20 mt-3 w-80 rounded-md border border-black bg-white shadow-lg  sm:right-0">
            <div className="px-5 py-3 border-b border-black ">
              <h5 className="text-sm font-semibold text-black ">
                Mensagens
              </h5>
            </div>

            <ul className="max-h-80 overflow-y-auto">
              <li>
                <Link
                  className="flex gap-4 border-t border-black px-5 py-4 hover:bg-blue-50  "
                  to="/messages"
                >
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src="https://www.alfredp2p.io/faviconai.png"
                      alt="User"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h6 className="text-sm font-semibold text-black ">
                      Usuário
                    </h6>
                    <p className="text-sm text-black ">
                      Não implementado
                    </p>
                    <p className="text-xs text-gray-500 ">
                      10min atrás
                    </p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
}
