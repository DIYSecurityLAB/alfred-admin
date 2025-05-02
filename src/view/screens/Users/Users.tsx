import { Pagination } from '@/components/Pagination';
import { ListedUser } from '@/domain/entities/User';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/models/permissions';
import { Container } from '@/view/components/Container';
import { Error } from '@/view/components/Error';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ToggleHeaderButton } from '@/view/layout/Page/ToggleHeaderButton';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, LayoutDashboard, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { UserCards } from './partials/Cards';
import { UserFilters } from './partials/Filter';
import { UserTable } from './partials/table';
import { useUsers } from './useUsers';

export function Users() {
  const {
    users,
    totalUsers,
    page,
    perPage,
    filters,
    isLoading,
    error,
    handlePageChange,
    handleFilterChange,
    clearFilters,
    setPerPage,
    openDetailsModal,
    clearError,
  } = useUsers();

  const { hasPermission } = useAuth();
  // Todos que podem visualizar usuários também podem ver seus detalhes
  const canViewDetails = true;
  // Apenas usuários com permissão específica podem editar
  const canEditUsers = hasPermission(Permission.USERS_EDIT);

  const [collapsedHeader, setCollapsedHeader] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const toggleHeader = () => {
    setCollapsedHeader(!collapsedHeader);
  };

  if (isLoading) {
    return <Loading label="Carregando usuários..." />;
  }

  return (
    <Container>
      <PageHeader
        title="Usuários"
        description="Gerencie todos os usuários do sistema."
        collapsed={collapsedHeader}
        toggle={toggleHeader}
        button={
          <div className="flex items-center gap-4">
            <ToggleHeaderButton
              toggle={toggleHeader}
              collapsed={collapsedHeader}
            />
          </div>
        }
      />

      <Error error={error} clear={clearError} />

      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden p-6"
      >
        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-800">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {filters.username || filters.userId
                ? 'Nenhum usuário corresponde aos filtros selecionados. Tente ajustar seus filtros.'
                : 'Não há usuários registrados no sistema.'}
            </p>
            {(filters.username || filters.userId) && (
              <motion.button
                onClick={clearFilters}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Limpar filtros
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            <motion.div
              className="mb-6 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-700">
                  Mostrando {users.length} de {totalUsers} resultados
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'table'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:shadow-sm'
                  }`}
                  title="Visualizar em tabela"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'cards'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:shadow-sm'
                  }`}
                  title="Visualizar em cards"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {viewMode === 'table' ? (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6"
                >
                  <UserTable
                    users={users as ListedUser[]}
                    onViewDetails={openDetailsModal}
                    canViewDetails={canViewDetails}
                    canEditUsers={canEditUsers}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-6"
                >
                  <UserCards
                    users={users as ListedUser[]}
                    onViewDetails={openDetailsModal}
                    canViewDetails={canViewDetails}
                    canEditUsers={canEditUsers}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Mostrar</span>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm bg-gray-50 hover:border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">itens por página</span>
              </div>

              <Pagination
                currentPage={page}
                totalItems={totalUsers}
                perPage={perPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </motion.div>
    </Container>
  );
}
