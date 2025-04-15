import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
// import Logo from "../../assets/logo/Logo.svg";
import { ArrowLeft, ChevronDown, LucideIcon } from "lucide-react";
import { ROUTES } from "@/view/routes/Routes";
import { SidebarLinkGroup } from "./SidebarLinkGroup";

type Item = {
  type: "link";
  icon: LucideIcon;
  label: string;
  path: string;
};

type DropItem = {
  path: string;
  label: string;
};

type DropdownItem = {
  type: "dropdown";
  icon: LucideIcon;
  label: string;
  activeCondition: boolean;
  dropItems: DropItem[];
};

export type SidebarItems = (Item | DropdownItem)[];

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  items: SidebarItems;
};

export function Sidebar({ sidebarOpen, setSidebarOpen, items }: SidebarProps) {
  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;

      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={classNames(
        "absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear",
        "lg:static lg:translate-x-0",
        sidebarOpen && "translate-x-0",
        !sidebarOpen && "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between gap-2 px-6 pt-6 lg:pt-8">
        <NavLink to={ROUTES.home} className="text-black text-xl font-bold">
          {/* <img src={Logo} alt="Logo" /> */}
          ALFRED P2P
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-black"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear pt-2">
        <nav className="py-4 px-4 lg:px-6">
          <div>
            <h3 className="text-sm font-semibold text-black">MENU</h3>

            <ul className="flex flex-col gap-1.5">
              {items.map((item) => {
                if (item.type === "link") {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          classNames(
                            "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out",
                            isActive
                              ? "bg-blue-500 text-white"
                              : "text-black hover:bg-gray-100 hover:text-blue-500"
                          )
                        }
                      >
                        <Icon size={20} />
                        {item.label}
                      </NavLink>
                    </li>
                  );
                }

                if (item.type === "dropdown") {
                  const Icon = item.icon;
                  return (
                    <SidebarLinkGroup
                      activeCondition={item.activeCondition}
                      key={item.label}
                    >
                      {(handleClick, open) => (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (sidebarExpanded) handleClick();
                              else setSidebarExpanded(true);
                            }}
                            className={classNames(
                              "w-full text-left flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out",
                              item.activeCondition
                                ? "bg-blue-500 text-white"
                                : "text-black hover:bg-gray-100 hover:text-blue-500"
                            )}
                          >
                            <Icon size={20} />
                            {item.label}
                            <ChevronDown
                              size={18}
                              className={classNames(
                                "ml-auto transition-transform",
                                open && "rotate-180"
                              )}
                            />
                          </button>
                          <div
                            className={classNames(
                              "overflow-hidden transition-[max-height] duration-300",
                              open ? "max-h-40" : "max-h-0"
                            )}
                          >
                            <ul className="mt-2 flex flex-col gap-2 pl-8">
                              {item.dropItems.map((dropitem) => (
                                <li key={dropitem.label}>
                                  <NavLink
                                    to={dropitem.path}
                                    className={({ isActive }) =>
                                      classNames(
                                        "block rounded-md px-4 py-1 font-medium duration-300 ease-in-out",
                                        isActive
                                          ? "bg-blue-400 text-white"
                                          : "text-black hover:bg-gray-100 hover:text-blue-500"
                                      )
                                    }
                                  >
                                    {dropitem.label}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </SidebarLinkGroup>
                  );
                }

                return null;
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
