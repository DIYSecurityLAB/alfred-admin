/**
 * Enumeração de todas as permissões possíveis no sistema
 *
 * Nomenclatura: area_ação
 * Exemplo: coupons_view, coupons_edit, etc.
 */
export enum Permission {
  // Permissões para Dashboard
  DASHBOARD_VIEW = 'dashboard_view',

  // Permissões para Cupons
  COUPONS_VIEW = 'coupons_view',
  COUPONS_CREATE = 'coupons_create',
  COUPONS_EDIT = 'coupons_edit',
  COUPONS_DELETE = 'coupons_delete',

  // Permissões para Vendas (Sales)
  SALES_VIEW = 'sales_view',
  SALES_MANAGE = 'sales_manage',

  // Permissões para Relatórios (Reports)
  REPORTS_VIEW = 'reports_view',
  REPORTS_EXPORT = 'reports_export',

  // Permissões para Usuários
  USERS_VIEW = 'users_view',
  USERS_MANAGE = 'users_manage',
  USERS_BLOCK = 'users_block',
  USERS_EDIT = 'users_edit', // Nova permissão para editar usuários
  USERS_DETAILS_VIEW = 'users_details_view', // Permissão para visualizar detalhes de usuários

  // Permissões para Configurações
  SETTINGS_VIEW = 'settings_view',
  SETTINGS_EDIT = 'settings_edit',

  // Permissões de Administração de Usuários do Sistema
  USER_MANAGEMENT_VIEW = 'user_management_view',
  USER_MANAGEMENT_EDIT = 'user_management_edit',
}

/**
 * Interface que define o conjunto de permissões para uma role
 */
export interface RoleDefinition {
  name: string;
  description: string;
  permissions: Permission[];
}

/**
 * Lista de todas as roles disponíveis no sistema
 */
export const ROLES: { [key: string]: RoleDefinition } = {
  // Role de visualização geral - pode ver tudo, mas não editar nada
  VIEWER: {
    name: 'Visualizador Geral',
    description:
      'Pode visualizar todas as áreas do sistema, mas não pode fazer alterações',
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.COUPONS_VIEW,
      Permission.SALES_VIEW,
      Permission.REPORTS_VIEW,
      Permission.USERS_VIEW,
      Permission.USERS_DETAILS_VIEW,
      Permission.SETTINGS_VIEW,
    ],
  },

  // Role de visualização apenas de cupons
  COUPONS_VIEWER: {
    name: 'Visualizador de Cupons',
    description: 'Pode visualizar apenas a seção de cupons',
    permissions: [Permission.DASHBOARD_VIEW, Permission.COUPONS_VIEW],
  },

  // Role de visualização apenas de vendas
  SALES_VIEWER: {
    name: 'Visualizador de Vendas',
    description: 'Pode visualizar apenas a seção de vendas',
    permissions: [Permission.DASHBOARD_VIEW, Permission.SALES_VIEW],
  },

  // Role de visualização apenas de relatórios
  REPORTS_VIEWER: {
    name: 'Visualizador de Relatórios',
    description: 'Pode visualizar apenas a seção de relatórios',
    permissions: [Permission.DASHBOARD_VIEW, Permission.REPORTS_VIEW],
  },

  // Role específica para visualização de usuários
  USERS_VIEWER: {
    name: 'Visualizador de Usuários',
    description: 'Pode visualizar a lista de usuários e seus detalhes',
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.USERS_VIEW,
      Permission.USERS_DETAILS_VIEW,
    ],
  },

  // Role de visualização de vendas e relatórios
  SALES_REPORTS_VIEWER: {
    name: 'Visualizador de Vendas e Relatórios',
    description: 'Pode visualizar as seções de vendas e relatórios',
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.SALES_VIEW,
      Permission.REPORTS_VIEW,
    ],
  },

  // Role de gerente de cupons
  COUPONS_MANAGER: {
    name: 'Gerente de Cupons',
    description: 'Pode visualizar, criar, editar e excluir cupons',
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.COUPONS_VIEW,
      Permission.COUPONS_CREATE,
      Permission.COUPONS_EDIT,
      Permission.COUPONS_DELETE,
    ],
  },

  // Role de gerente de vendas
  SALES_MANAGER: {
    name: 'Gerente de Vendas',
    description: 'Pode visualizar e gerenciar vendas',
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.SALES_VIEW,
      Permission.SALES_MANAGE,
      Permission.REPORTS_VIEW,
    ],
  },

  // Role de gerente de usuários
  USERS_MANAGER: {
    name: 'Gerente de Usuários',
    description: 'Pode visualizar e gerenciar usuários, incluindo bloqueio',
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.USERS_VIEW,
      Permission.USERS_DETAILS_VIEW,
      Permission.USERS_EDIT,
      Permission.USERS_MANAGE,
      Permission.USERS_BLOCK,
    ],
  },

  // Role de administrador (acesso a tudo, exceto gerenciamento de usuários do sistema)
  ADMIN: {
    name: 'Administrador',
    description:
      'Acesso administrativo a todas as funcionalidades, exceto gerenciar usuários do sistema',
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.COUPONS_VIEW,
      Permission.COUPONS_CREATE,
      Permission.COUPONS_EDIT,
      Permission.COUPONS_DELETE,
      Permission.SALES_VIEW,
      Permission.SALES_MANAGE,
      Permission.REPORTS_VIEW,
      Permission.REPORTS_EXPORT,
      Permission.USERS_VIEW,
      Permission.USERS_DETAILS_VIEW,
      Permission.USERS_EDIT,
      Permission.USERS_MANAGE,
      Permission.USERS_BLOCK,
      Permission.SETTINGS_VIEW,
      Permission.SETTINGS_EDIT,
    ],
  },

  // Role de super administrador (acesso completo, incluindo gerenciamento de usuários do sistema)
  SUPERADMIN: {
    name: 'Super Administrador',
    description: 'Acesso completo a todas as funcionalidades do sistema',
    permissions: [
      Permission.DASHBOARD_VIEW,
      Permission.COUPONS_VIEW,
      Permission.COUPONS_CREATE,
      Permission.COUPONS_EDIT,
      Permission.COUPONS_DELETE,
      Permission.SALES_VIEW,
      Permission.SALES_MANAGE,
      Permission.REPORTS_VIEW,
      Permission.REPORTS_EXPORT,
      Permission.USERS_VIEW,
      Permission.USERS_DETAILS_VIEW,
      Permission.USERS_EDIT,
      Permission.USERS_MANAGE,
      Permission.USERS_BLOCK,
      Permission.SETTINGS_VIEW,
      Permission.SETTINGS_EDIT,
      Permission.USER_MANAGEMENT_VIEW,
      Permission.USER_MANAGEMENT_EDIT,
    ],
  },
};

/**
 * Tipo que define as roles disponíveis para um usuário
 */
export type UserRole = keyof typeof ROLES;

/**
 * Verifica se uma role existe
 */
export function isValidRole(role: string): role is UserRole {
  return role in ROLES;
}

/**
 * Verifica se uma role tem uma permissão específica
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (!isValidRole(role)) return false;
  return ROLES[role].permissions.includes(permission);
}

/**
 * Retorna todas as permissões de uma role
 */
export function getPermissions(role: UserRole): Permission[] {
  if (!isValidRole(role)) return [];
  return ROLES[role].permissions;
}

/**
 * Verifica se uma role tem todas as permissões especificadas
 */
export function hasPermissions(
  role: UserRole,
  permissions: Permission[],
): boolean {
  if (!isValidRole(role)) return false;
  return permissions.every((permission) =>
    ROLES[role].permissions.includes(permission),
  );
}

/**
 * Verifica se um usuário com múltiplas roles tem uma permissão específica
 */
export function userHasPermission(
  roles: UserRole[],
  permission: Permission,
): boolean {
  return roles.some((role) => hasPermission(role, permission));
}

/**
 * Verifica se um usuário com múltiplas roles tem todas as permissões especificadas
 */
export function userHasPermissions(
  roles: UserRole[],
  permissions: Permission[],
): boolean {
  return permissions.every((permission) =>
    userHasPermission(roles, permission),
  );
}
