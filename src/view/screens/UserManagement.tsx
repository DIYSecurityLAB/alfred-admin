import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  CreditCard,
  Filter,
  LayoutDashboard,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  Star,
  Tag,
  Tags,
  User,
  UserCheck,
  UserCog,
  UserX,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { db } from '../../configs/firebase';
import { useAuth } from '../../hooks/useAuth';
import { Permission, PermissionPresets } from '../../models/permissions';
import { Button } from '../components/Button';
import { Container } from '../components/Container';
import { Error } from '../components/Error';
import { Loading } from '../components/Loading';
import { PageHeader } from '../layout/Page/PageHeader';

interface UserData {
  id: string;
  email: string;
  permissions: Permission[];
  loginCount: number;
  lastLogin: { seconds: number; nanoseconds: number };
  createdAt: { seconds: number; nanoseconds: number };
  hasPassword?: boolean;
}

type PermissionCategory = {
  name: string;
  icon: React.ReactNode;
  permissions: Permission[];
};

// Componente para o modal de permissões
function PermissionsModal({
  isOpen,
  onClose,
  user,
  selectedPermissions,
  setSelectedPermissions,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  selectedPermissions: Permission[];
  setSelectedPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  onSave: () => void;
  isSaving: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Categorias de permissões
  const permissionCategories: PermissionCategory[] = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      permissions: [Permission.DASHBOARD_VIEW],
    },
    {
      name: 'Cupons',
      icon: <Tags className="h-4 w-4" />,
      permissions: [
        Permission.COUPONS_VIEW,
        Permission.COUPONS_CREATE,
        Permission.COUPONS_EDIT,
        Permission.COUPONS_DELETE,
      ],
    },
    {
      name: 'Vendas e Relatórios',
      icon: <CreditCard className="h-4 w-4" />,
      permissions: [
        Permission.SALES_VIEW,
        Permission.SALES_MANAGE,
        Permission.REPORTS_VIEW,
        Permission.REPORTS_EXPORT,
        Permission.REPORTS_DETAILS_VIEW,
      ],
    },
    {
      name: 'Usuários',
      icon: <User className="h-4 w-4" />,
      permissions: [
        Permission.USERS_VIEW,
        Permission.USERS_DETAILS_VIEW,
        Permission.USERS_EDIT,
        Permission.USERS_MANAGE,
      ],
    },
    {
      name: 'Usuários Bloqueados',
      icon: <UserX className="h-4 w-4" />,
      permissions: [Permission.USERS_BLOCK_VIEW, Permission.USERS_BLOCK_MANAGE],
    },
    {
      name: 'Configurações',
      icon: <Settings className="h-4 w-4" />,
      permissions: [Permission.SETTINGS_VIEW, Permission.SETTINGS_EDIT],
    },
    {
      name: 'Gerenciamento de Usuários',
      icon: <UserCog className="h-4 w-4" />,
      permissions: [
        Permission.USER_MANAGEMENT_VIEW,
        Permission.USER_MANAGEMENT_EDIT,
      ],
    },
  ];

  // Presets de permissões
  const presets = [
    {
      name: 'Visualizador Básico',
      permissions: PermissionPresets.BASIC_VIEWER,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
    },
    {
      name: 'Visualizador Completo',
      permissions: PermissionPresets.FULL_VIEWER,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      name: 'Administrador',
      permissions: PermissionPresets.ADMIN,
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    {
      name: 'Super Admin',
      permissions: PermissionPresets.SUPERADMIN,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  // Funções para gerenciar permissões
  const togglePermission = (permission: Permission) => {
    setSelectedPermissions((prev: Permission[]) => {
      if (prev.includes(permission)) {
        return prev.filter((p: Permission) => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
    setActivePreset(null);
  };

  const toggleCategoryPermissions = (category: PermissionCategory) => {
    const categoryPermissions: Permission[] = category.permissions;
    const allIncluded = categoryPermissions.every((p: Permission) =>
      selectedPermissions.includes(p),
    );

    if (allIncluded) {
      // Remove todas as permissões da categoria
      setSelectedPermissions((prev: Permission[]) =>
        prev.filter((p: Permission) => !categoryPermissions.includes(p)),
      );
    } else {
      // Adiciona todas as permissões da categoria que ainda não estão selecionadas
      const permissionsToAdd = categoryPermissions.filter(
        (p: Permission) => !selectedPermissions.includes(p),
      );
      setSelectedPermissions((prev: Permission[]) => [
        ...prev,
        ...permissionsToAdd,
      ]);
    }
    setActivePreset(null);
  };

  const applyPreset = (presetPermissions: Permission[], presetName: string) => {
    setSelectedPermissions(presetPermissions);
    setActivePreset(presetName);
  };

  const clearAllPermissions = () => {
    setSelectedPermissions([]);
    setActivePreset(null);
  };

  // Filtragem de permissões com base na busca
  const getFilteredCategories = () => {
    if (!searchTerm) return permissionCategories;

    return permissionCategories
      .map((category) => {
        const filteredPermissions = category.permissions.filter((permission) =>
          getPermissionLabel(permission)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        );

        return {
          ...category,
          permissions: filteredPermissions,
        };
      })
      .filter((category) => category.permissions.length > 0);
  };

  const getPermissionLabel = (permission: Permission): string => {
    const labels: Record<Permission, string> = {
      [Permission.DASHBOARD_VIEW]: 'Visualizar Dashboard',
      [Permission.COUPONS_VIEW]: 'Ver Cupons',
      [Permission.COUPONS_CREATE]: 'Criar Cupons',
      [Permission.COUPONS_EDIT]: 'Editar Cupons',
      [Permission.COUPONS_DELETE]: 'Excluir Cupons',
      [Permission.SALES_VIEW]: 'Ver Vendas',
      [Permission.SALES_MANAGE]: 'Gerenciar Vendas',
      [Permission.REPORTS_VIEW]: 'Ver Relatórios',
      [Permission.REPORTS_EXPORT]: 'Exportar Relatórios',
      [Permission.REPORTS_DETAILS_VIEW]: 'Ver Detalhes de Relatórios',
      [Permission.USERS_VIEW]: 'Ver Usuários',
      [Permission.USERS_DETAILS_VIEW]: 'Ver Detalhes de Usuários',
      [Permission.USERS_EDIT]: 'Editar Usuários',
      [Permission.USERS_MANAGE]: 'Gerenciar Usuários',
      [Permission.USERS_BLOCK_VIEW]: 'Ver Bloqueados',
      [Permission.USERS_BLOCK_MANAGE]: 'Gerenciar Bloqueios',
      [Permission.SETTINGS_VIEW]: 'Ver Configurações',
      [Permission.SETTINGS_EDIT]: 'Editar Configurações',
      [Permission.USER_MANAGEMENT_VIEW]: 'Ver Gestão de Usuários',
      [Permission.USER_MANAGEMENT_EDIT]: 'Editar Gestão de Usuários',
    };
    return labels[permission] || permission;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Gerenciar Permissões
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Corpo */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-130px)]">
          {/* Barra de busca e presets */}
          <div className="mb-6">
            <div className="relative flex-grow max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar permissões..."
                className="pl-10 py-2.5 pr-4 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                Perfis de Acesso Pré-definidos
              </div>

              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.permissions, preset.name)}
                    className={`px-3 py-2 text-sm rounded-lg border flex items-center gap-1 transition-all ${
                      activePreset === preset.name
                        ? `${preset.color} font-medium ring-2 ring-offset-1`
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {preset.name}
                    <span className="ml-1 bg-white bg-opacity-50 px-1.5 py-0.5 rounded-full text-xs">
                      {preset.permissions.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Categorias de permissões */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Permissões Específicas
              <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {selectedPermissions.length}
              </span>
            </div>

            {getFilteredCategories().map((category) => (
              <div
                key={category.name}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleCategoryPermissions(category)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                    <span className="ml-1 bg-white text-gray-800 px-2 py-0.5 rounded-full text-xs border border-gray-200">
                      {category.permissions.length}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      {
                        category.permissions.filter((p) =>
                          selectedPermissions.includes(p),
                        ).length
                      }{' '}
                      / {category.permissions.length}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </button>

                <div className="p-3 bg-white border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {category.permissions.map((permission) => (
                      <label
                        key={permission}
                        className={`flex items-center p-2 rounded-lg cursor-pointer ${
                          selectedPermissions.includes(permission)
                            ? 'bg-blue-50 border border-blue-100'
                            : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 mr-2 flex-shrink-0 rounded border ${
                            selectedPermissions.includes(permission)
                              ? 'bg-blue-500 border-blue-500 flex items-center justify-center'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedPermissions.includes(permission) && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm">
                          {getPermissionLabel(permission)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {getFilteredCategories().length === 0 && (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Nenhuma permissão encontrada.</p>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <button
              onClick={clearAllPermissions}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Limpar todas
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-1"
            >
              {isSaving ? (
                <>Salvando...</>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Salvar alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserManagement() {
  const { hasPermission } = useAuth();
  const canEditPermissions = hasPermission(Permission.USER_MANAGEMENT_EDIT);

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ permission?: Permission }>({});
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    [],
  );
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const usersRef = collection(db, 'users');

      // Criar a query
      const usersQuery = query(usersRef);

      const querySnapshot = await getDocs(usersQuery);

      const usersData: UserData[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({
          id: doc.id,
          ...(doc.data() as Omit<UserData, 'id'>),
        });
      });

      setUsers(usersData);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError('Não foi possível carregar os usuários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async () => {
    if (!editingUser || !canEditPermissions) {
      setError('Você não tem permissão para alterar permissões de usuários.');
      return;
    }

    setUpdateLoading(true);
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        permissions: selectedPermissions,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? { ...user, permissions: selectedPermissions }
            : user,
        ),
      );

      setEditingUser(null);
      toast.success('Permissões atualizadas com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar as permissões do usuário:', err);
      setError(
        'Não foi possível atualizar as permissões do usuário. Tente novamente.',
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const getPermissionLabel = (permission: Permission): string => {
    // Função para apresentar label amigável para permissão
    const labels: Record<Permission, string> = {
      [Permission.DASHBOARD_VIEW]: 'Visualizar Dashboard',
      [Permission.COUPONS_VIEW]: 'Ver Cupons',
      [Permission.COUPONS_CREATE]: 'Criar Cupons',
      [Permission.COUPONS_EDIT]: 'Editar Cupons',
      [Permission.COUPONS_DELETE]: 'Excluir Cupons',
      [Permission.SALES_VIEW]: 'Ver Vendas',
      [Permission.SALES_MANAGE]: 'Gerenciar Vendas',
      [Permission.REPORTS_VIEW]: 'Ver Relatórios',
      [Permission.REPORTS_EXPORT]: 'Exportar Relatórios',
      [Permission.REPORTS_DETAILS_VIEW]: 'Ver Detalhes de Relatórios',
      [Permission.USERS_VIEW]: 'Ver Usuários',
      [Permission.USERS_DETAILS_VIEW]: 'Ver Detalhes de Usuários',
      [Permission.USERS_EDIT]: 'Editar Usuários',
      [Permission.USERS_MANAGE]: 'Gerenciar Usuários',
      [Permission.USERS_BLOCK_VIEW]: 'Ver Bloqueados',
      [Permission.USERS_BLOCK_MANAGE]: 'Gerenciar Bloqueios',
      [Permission.SETTINGS_VIEW]: 'Ver Configurações',
      [Permission.SETTINGS_EDIT]: 'Editar Configurações',
      [Permission.USER_MANAGEMENT_VIEW]: 'Ver Gestão de Usuários',
      [Permission.USER_MANAGEMENT_EDIT]: 'Editar Gestão de Usuários',
    };
    return labels[permission] || permission;
  };

  const openPermissionsModal = (user: UserData) => {
    setEditingUser(user);
    setSelectedPermissions(user.permissions || []);
  };

  const closePermissionsModal = () => {
    setEditingUser(null);
  };

  if (loading) {
    return <Loading label="Carregando usuários..." />;
  }

  return (
    <Container>
      <PageHeader
        title="Gerenciamento de Usuários"
        description="Gerencie as permissões de todos os usuários do sistema"
        collapsed={false}
        toggle={() => {}}
        button={
          <Button
            onClick={() => fetchUsers()}
            icon={<UserCheck className="h-5 w-5" />}
            label="Atualizar Lista"
          />
        }
      />

      {error && <Error error={error} clear={() => setError(null)} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-100 p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Usuários Registrados</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {users.length}
            </span>
          </h2>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setFilters({})}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 text-gray-500" />
                <span>Filtrar</span>
                {Object.keys(filters).length > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                <span>Ordenar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acessos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(user.permissions || [])
                        .slice(0, 3)
                        .map((permission, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                            title={getPermissionLabel(permission)}
                          >
                            {permission.split('_')[0]}
                          </span>
                        ))}
                      {(user.permissions || []).length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          +{(user.permissions || []).length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.loginCount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(user.lastLogin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {canEditPermissions && (
                        <button
                          onClick={() => openPermissionsModal(user)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-md transition-colors"
                          title="Alterar permissões"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-md transition-colors"
                        title="Mais ações"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-10">
            <div className="bg-blue-50 p-3 rounded-full inline-flex mb-4">
              <User className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-800">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Não há usuários registrados no sistema ainda.
            </p>
          </div>
        )}
      </motion.div>

      {/* Modal para edição de permissões */}
      <AnimatePresence>
        {editingUser && (
          <PermissionsModal
            isOpen={!!editingUser}
            onClose={closePermissionsModal}
            user={editingUser}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
            onSave={handlePermissionChange}
            isSaving={updateLoading}
          />
        )}
      </AnimatePresence>
    </Container>
  );
}
