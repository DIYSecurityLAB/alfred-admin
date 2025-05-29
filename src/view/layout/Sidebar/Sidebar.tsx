import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/models/permissions';
import { ROUTES } from '@/view/routes/Routes';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Lock,
  LucideIcon,
  Settings,
  Tags,
  UserCog,
  UserX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SidebarLinkGroup } from './SidebarLinkGroup';

type Item = {
  type: 'link';
  icon: LucideIcon;
  label: string;
  path: string;
  requiredPermission?: Permission | Permission[];
};

type DropItem = {
  path: string;
  label: string;
  requiredPermission?: Permission | Permission[];
};

type DropdownItem = {
  type: 'dropdown';
  icon: LucideIcon;
  label: string;
  activeCondition: boolean;
  requiredPermission?: Permission | Permission[];
  dropItems: DropItem[];
};

export type SidebarItems = (Item | DropdownItem)[];

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
};

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { hasPermission } = useAuth();
  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const { pathname } = useLocation();

  const menuItems: SidebarItems = [
    {
      type: 'link',
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: ROUTES.dashboard,
      requiredPermission: Permission.DASHBOARD_VIEW,
    },
    {
      type: 'link',
      icon: Tags,
      label: 'Cupons',
      path: ROUTES.coupons,
      requiredPermission: Permission.COUPONS_VIEW,
    },
    {
      type: 'link',
      icon: CreditCard,
      label: 'Vendas',
      path: ROUTES.sales.home,
      requiredPermission: Permission.SALES_VIEW,
    },
    {
      type: 'dropdown',
      icon: UserX,
      label: 'Usuários',
      activeCondition:
        pathname.includes('user') || pathname.includes('blocked'),
      requiredPermission: Permission.USERS_VIEW,
      dropItems: [
        {
          path: ROUTES.users.home,
          label: 'Listar Usuários',
          requiredPermission: Permission.USERS_VIEW,
        },
        {
          path: ROUTES.users.vips.home,
          label: 'Usuários Vips',
          requiredPermission: Permission.USERS_VIEW,
        },
        {
          path: ROUTES.users.blocked.home,
          label: 'Usuários Bloqueados',
          requiredPermission: Permission.USERS_BLOCK_VIEW, // Usando a nova permissão específica
        },
      ],
    },
    {
      type: 'link',
      icon: Settings,
      label: 'Configurações',
      path: ROUTES.settings,
      requiredPermission: Permission.SETTINGS_VIEW,
    },
    {
      type: 'link',
      icon: UserCog,
      label: 'Gerenciamento de Usuários',
      path: ROUTES.userManagement,
      requiredPermission: Permission.USER_MANAGEMENT_VIEW, // Usando a permissão correta
    },
  ];

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
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== 'Escape') return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  // Verificar se o usuário tem acesso ao item do menu
  const checkAccess = (requiredPermission?: Permission | Permission[]) => {
    if (!requiredPermission) return true; // Se não requer permissão específica, todos têm acesso

    // Verificar se tem todas as permissões necessárias
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.some((permission) => hasPermission(permission));
    }

    // Verificar uma permissão única
    return hasPermission(requiredPermission);
  };

  return (
    <aside
      ref={sidebar}
      className={classNames(
        'absolute left-0 top-0 z-[900] flex h-screen w-72 flex-col',
        'bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg',
        'transition-all duration-300 ease-in-out',
        'lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex-shrink-0 flex items-center justify-between px-6 pt-6 pb-4 border-b border-blue-700 lg:pt-8">
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

      <div className="flex-grow overflow-y-auto">
        <nav className="px-4 lg:px-6 py-4">
          <div>
            <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider ml-2 mb-4">
              MENU
            </h3>

            <ul className="flex flex-col gap-2">
              {menuItems.map((item) => {
                if (item.type === 'link') {
                  const Icon = item.icon;
                  const hasAccess = checkAccess(item.requiredPermission);

                  return (
                    <li
                      key={item.label}
                      className={!hasAccess ? 'opacity-70' : ''}
                    >
                      <NavLink
                        to={hasAccess ? item.path : '#'}
                        onClick={(e) => {
                          if (!hasAccess) e.preventDefault();
                        }}
                        className={({ isActive }) =>
                          classNames(
                            'group relative flex items-center gap-3 rounded-lg py-2.5 px-4 font-medium',
                            'transition-all duration-200 ease-in-out',
                            isActive && hasAccess
                              ? 'bg-white/10 text-white backdrop-blur-sm shadow-md'
                              : 'text-blue-100 hover:bg-white/5 hover:text-white',
                            !hasAccess && 'cursor-not-allowed',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={classNames(
                                'flex items-center justify-center p-1.5 rounded-md',
                                isActive && hasAccess
                                  ? 'bg-blue-500 text-white'
                                  : 'text-blue-200 group-hover:text-white',
                              )}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="font-medium text-sm flex-1">
                              {item.label}
                            </span>

                            {!hasAccess && (
                              <Lock size={16} className="text-blue-300" />
                            )}

                            {isActive && hasAccess && (
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

                if (item.type === 'dropdown') {
                  const Icon = item.icon;
                  const hasAccess = checkAccess(item.requiredPermission);

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
                              if (hasAccess) {
                                if (sidebarExpanded) handleClick();
                                else setSidebarExpanded(true);
                              }
                            }}
                            className={classNames(
                              'w-full text-left flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium',
                              'transition-all duration-200 ease-in-out',
                              item.activeCondition && hasAccess
                                ? 'bg-white/10 text-white backdrop-blur-sm shadow-md'
                                : 'text-blue-100 hover:bg-white/5 hover:text-white',
                              !hasAccess && 'cursor-not-allowed opacity-70',
                            )}
                          >
                            <span
                              className={classNames(
                                'flex items-center justify-center p-1.5 rounded-md',
                                item.activeCondition && hasAccess
                                  ? 'bg-blue-500 text-white'
                                  : 'text-blue-200 group-hover:text-white',
                              )}
                            >
                              <Icon size={18} />
                            </span>
                            <span className="font-medium text-sm flex-1">
                              {item.label}
                            </span>

                            {!hasAccess ? (
                              <Lock size={16} className="text-blue-300" />
                            ) : (
                              <ChevronDown
                                size={16}
                                className={classNames(
                                  'transition-transform duration-300',
                                  open ? 'rotate-180' : 'rotate-0',
                                )}
                              />
                            )}
                          </button>

                          {hasAccess && (
                            <AnimatePresence initial={false}>
                              {open && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    ease: 'easeInOut',
                                  }}
                                  className="overflow-hidden"
                                >
                                  <ul className="mt-2 flex flex-col gap-1 ml-10 mr-2">
                                    {item.dropItems.map((dropitem) => {
                                      const dropItemAccess = checkAccess(
                                        dropitem.requiredPermission,
                                      );

                                      return (
                                        <li
                                          key={dropitem.label}
                                          className={
                                            !dropItemAccess ? 'opacity-70' : ''
                                          }
                                        >
                                          <NavLink
                                            to={
                                              dropItemAccess
                                                ? dropitem.path
                                                : '#'
                                            }
                                            onClick={(e) => {
                                              if (!dropItemAccess)
                                                e.preventDefault();
                                            }}
                                            className={({ isActive }) =>
                                              classNames(
                                                'block rounded-md px-4 py-2 text-xs font-medium',
                                                'transition-all duration-200 ease-in-out',
                                                isActive && dropItemAccess
                                                  ? 'bg-blue-600/50 text-white shadow-sm'
                                                  : 'text-blue-200 hover:bg-white/5 hover:text-white',
                                                !dropItemAccess &&
                                                  'cursor-not-allowed',
                                              )
                                            }
                                          >
                                            <div className="flex items-center justify-between">
                                              <span>{dropitem.label}</span>
                                              {!dropItemAccess && (
                                                <Lock
                                                  size={12}
                                                  className="text-blue-300"
                                                />
                                              )}
                                            </div>
                                          </NavLink>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
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

      <div className="flex-shrink-0 border-t border-blue-700 px-6 py-4">
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
