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
  REPORTS_DETAILS_VIEW = 'reports_details_view',

  // Permissões para Usuários
  USERS_VIEW = 'users_view',
  USERS_MANAGE = 'users_manage',
  USERS_BLOCK = 'users_block',
  USERS_BLOCK_VIEW = 'users_block_view',
  USERS_BLOCK_MANAGE = 'users_block_manage',
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
 * Conjuntos predefinidos de permissões para casos de uso comuns
 */
export const PermissionPresets = {
  BASIC_VIEWER: [
    Permission.DASHBOARD_VIEW,
    Permission.USERS_VIEW,
    Permission.USERS_DETAILS_VIEW,
  ],

  FULL_VIEWER: [
    Permission.DASHBOARD_VIEW,
    Permission.COUPONS_VIEW,
    Permission.SALES_VIEW,
    Permission.REPORTS_VIEW,
    Permission.USERS_VIEW,
    Permission.USERS_DETAILS_VIEW,
    Permission.USERS_BLOCK_VIEW,
    Permission.SETTINGS_VIEW,
  ],

  ADMIN: [
    Permission.DASHBOARD_VIEW,
    Permission.COUPONS_VIEW,
    Permission.COUPONS_CREATE,
    Permission.COUPONS_EDIT,
    Permission.COUPONS_DELETE,
    Permission.SALES_VIEW,
    Permission.SALES_MANAGE,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_EXPORT,
    Permission.REPORTS_DETAILS_VIEW,
    Permission.USERS_VIEW,
    Permission.USERS_DETAILS_VIEW,
    Permission.USERS_EDIT,
    Permission.USERS_MANAGE,
    Permission.USERS_BLOCK_VIEW,
    Permission.USERS_BLOCK_MANAGE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
  ],

  SUPERADMIN: [
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
    Permission.USERS_BLOCK_VIEW,
    Permission.USERS_BLOCK_MANAGE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
    Permission.USER_MANAGEMENT_VIEW,
    Permission.USER_MANAGEMENT_EDIT,
  ],
};

/**
 * Verifica se um conjunto de permissões inclui uma permissão específica
 */
export function hasPermission(
  userPermissions: Permission[],
  permission: Permission,
): boolean {
  return userPermissions.includes(permission);
}

/**
 * Verifica se um conjunto de permissões inclui todas as permissões especificadas
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  permissions: Permission[],
): boolean {
  return permissions.every((permission) =>
    userPermissions.includes(permission),
  );
}

/**
 * Verifica se um conjunto de permissões inclui pelo menos uma das permissões especificadas
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => userPermissions.includes(permission));
}

/**
 * Obtém um nome legível para uma permissão
 */
export function getPermissionName(permission: Permission): string {
  switch (permission) {
    case Permission.DASHBOARD_VIEW:
      return 'Visualizar Dashboard';
    case Permission.COUPONS_VIEW:
      return 'Visualizar Cupons';
    case Permission.COUPONS_CREATE:
      return 'Criar Cupons';
    case Permission.COUPONS_EDIT:
      return 'Editar Cupons';
    case Permission.COUPONS_DELETE:
      return 'Excluir Cupons';
    case Permission.SALES_VIEW:
      return 'Visualizar Vendas';
    case Permission.SALES_MANAGE:
      return 'Gerenciar Vendas';
    case Permission.REPORTS_VIEW:
      return 'Visualizar Relatórios';
    case Permission.REPORTS_EXPORT:
      return 'Exportar Relatórios';
    case Permission.REPORTS_DETAILS_VIEW:
      return 'Visualizar Detalhes dos Relatórios';
    case Permission.USERS_VIEW:
      return 'Visualizar Usuários';
    case Permission.USERS_DETAILS_VIEW:
      return 'Visualizar Detalhes de Usuários';
    case Permission.USERS_EDIT:
      return 'Editar Usuários';
    case Permission.USERS_MANAGE:
      return 'Gerenciar Usuários';
    case Permission.USERS_BLOCK_VIEW:
      return 'Visualizar Usuários Bloqueados';
    case Permission.USERS_BLOCK_MANAGE:
      return 'Gerenciar Bloqueio de Usuários';
    case Permission.SETTINGS_VIEW:
      return 'Visualizar Configurações';
    case Permission.SETTINGS_EDIT:
      return 'Editar Configurações';
    case Permission.USER_MANAGEMENT_VIEW:
      return 'Visualizar Gerenciamento de Usuários';
    case Permission.USER_MANAGEMENT_EDIT:
      return 'Editar Gerenciamento de Usuários';
    default:
      return permission;
  }
}
