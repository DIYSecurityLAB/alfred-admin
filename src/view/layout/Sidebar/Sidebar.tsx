import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft, ChevronDown, LucideIcon } from "lucide-react";
import { ROUTES } from "@/view/routes/Routes";
import { SidebarLinkGroup } from "./SidebarLinkGroup";
import { motion, AnimatePresence } from "framer-motion";

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
        "absolute left-0 top-0 z-9999 flex h-screen flex-col overflow-y-hidden",
        "w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg",
        "transition-all duration-300 ease-in-out",
        "lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-blue-700 lg:pt-8">
        <NavLink
          to={ROUTES.home}
          className="text-white text-xl font-bold flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
            <span className="text-blue-900 text-lg font-bold">A</span>
          </div>
          <span className="tracking-wide">ALFRED P2P</span>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white hover:text-blue-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear py-4">
        <nav className="px-4 lg:px-6">
          <div>
            <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider ml-2 mb-4">
              MENU
            </h3>

            <ul className="flex flex-col gap-2">
              {items.map((item) => {
                if (item.type === "link") {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          classNames(
                            "group relative flex items-center gap-3 rounded-lg py-2.5 px-4 font-medium",
                            "transition-all duration-200 ease-in-out",
                            isActive
                              ? "bg-white/10 text-white backdrop-blur-sm shadow-md"
                              : "text-blue-100 hover:bg-white/5 hover:text-white"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={classNames(
                                "flex items-center justify-center p-1.5 rounded-md",
                                isActive
                                  ? "bg-blue-500 text-white"
                                  : "text-blue-200 group-hover:text-white"
                              )}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="font-medium text-sm">
                              {item.label}
                            </span>
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </>
                        )}
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
                              "w-full text-left flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium",
                              "transition-all duration-200 ease-in-out",
                              item.activeCondition
                                ? "bg-white/10 text-white backdrop-blur-sm shadow-md"
                                : "text-blue-100 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            <span
                              className={classNames(
                                "flex items-center justify-center p-1.5 rounded-md",
                                item.activeCondition
                                  ? "bg-blue-500 text-white"
                                  : "text-blue-200 group-hover:text-white"
                              )}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="font-medium text-sm">
                              {item.label}
                            </span>
                            <ChevronDown
                              size={16}
                              className={classNames(
                                "ml-auto transition-transform duration-300",
                                open ? "rotate-180" : "rotate-0"
                              )}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {open && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <ul className="mt-2 flex flex-col gap-1 ml-10 mr-2">
                                  {item.dropItems.map((dropitem) => (
                                    <li key={dropitem.label}>
                                      <NavLink
                                        to={dropitem.path}
                                        className={({ isActive }) =>
                                          classNames(
                                            "block rounded-md px-4 py-2 text-xs font-medium",
                                            "transition-all duration-200 ease-in-out",
                                            isActive
                                              ? "bg-blue-600/50 text-white shadow-sm"
                                              : "text-blue-200 hover:bg-white/5 hover:text-white"
                                          )
                                        }
                                      >
                                        {dropitem.label}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
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

      <div className="mt-auto border-t border-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
            DS
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">DIY SEC LAB</span>
            <span className="text-xs text-blue-300">ADMIN</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
