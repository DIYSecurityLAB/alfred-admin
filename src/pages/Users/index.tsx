import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { UserTable } from './components/UserTable';
import { UserCards } from './components/UserCards';
import { UserFilters } from './components/UserFilters';
import { UserDetailsModal } from './components/UserDetailsModal';
import { UserEditLevelModal } from './components/UserEditLevelModal';
import { StatusConfirmModal } from './components/StatusConfirmModal';
import { Pagination } from '../../components/Pagination';

export function Users() {
  const {
    users,
    totalUsers,
    page,
    perPage,
    filters,
    isLoading,
    selectedUser,
    isDetailsModalOpen,
    isEditModalOpen,
    isStatusConfirmOpen,
    handlePageChange,
    handleFilterChange,
    setPerPage,
    openDetailsModal,
    openEditModal,
    openStatusConfirm,
    setIsDetailsModalOpen,
    setIsEditModalOpen,
    setIsStatusConfirmOpen,
    updateUserStatus,
    updateUserLevel,
  } = useUsers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-text-secondary mt-1">Gerencie os usuários do sistema</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-surface rounded-xl p-6 shadow-sm">
        {/* Filtros */}
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Mensagem quando não há usuários */}
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhum usuário encontrado</h3>
            <p className="text-text-secondary text-center max-w-md mb-6">
              {(filters.username || filters.status !== 'all' || filters.level !== undefined) 
                ? 'Nenhum usuário corresponde aos filtros selecionados. Tente ajustar seus filtros.'
                : 'Não há usuários registrados no sistema.'}
            </p>
          </div>
        ) : (
          <>
            {/* Tabela Desktop */}
            <div className="hidden lg:block mb-6">
              <UserTable
                users={users}
                onViewDetails={openDetailsModal}
                onEdit={openEditModal}
                onToggleStatus={openStatusConfirm}
              />
            </div>

            {/* Cards Mobile */}
            <div className="lg:hidden mb-6">
              <UserCards
                users={users}
                onViewDetails={openDetailsModal}
                onEdit={openEditModal}
                onToggleStatus={openStatusConfirm}
              />
            </div>

            {/* Paginação */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Mostrar</span>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="bg-background border border-surface rounded-md px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-text-secondary">itens por página</span>
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
      </div>

      {/* Modais */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setIsDetailsModalOpen(false)}
            onEdit={() => {
              setIsDetailsModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />
        )}

        {isEditModalOpen && selectedUser && (
          <UserEditLevelModal
            user={selectedUser}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={async (level) => {
              await updateUserLevel(selectedUser.id, level);
            }}
          />
        )}

        {isStatusConfirmOpen && selectedUser && (
          <StatusConfirmModal
            user={selectedUser}
            onClose={() => setIsStatusConfirmOpen(false)}
            onConfirm={async () => {
              await updateUserStatus(selectedUser.id, !selectedUser.isActive);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}