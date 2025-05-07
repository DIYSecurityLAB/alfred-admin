import { Pagination } from '@/components/Pagination';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/models/permissions'; // Atualizado para usar o arquivo correto
import { Button } from '@/view/components/Button';
import { Container } from '@/view/components/Container';
import { Error } from '@/view/components/Error';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ToggleHeaderButton } from '@/view/layout/Page/ToggleHeaderButton';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, LayoutDashboard, LayoutGrid, Plus } from 'lucide-react';
import { useState } from 'react';
import { BlockedUserCards } from './partials/BlockedUserCards';
import { BlockUserModal } from './partials/BlockUserModel';
import { BlockedUserTable } from './partials/table';
import { useBlockUser } from './partials/useBlockUser';
import { useBlockedUsers } from './useBlockedUser';

export function BlockedUsers() {
  const {
    blockedUsers,
    totalBlockedUsers,
    page,
    perPage,
    isLoading,
    error,
    handlePageChange,
    setPerPage,
    clearError,
  } = useBlockedUsers();

  const { isModalOpen, openModal, closeModal } = useBlockUser();
  const { hasPermission } = useAuth();

  // Usar a permissão correta para gerenciar bloqueios
  const canBlockUsers = hasPermission(Permission.USERS_BLOCK_MANAGE);
  // Todos usuários com permissão de visualizar bloqueados podem ver detalhes
  const canViewDetails = true;

  const [collapsedHeader, setCollapsedHeader] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const toggleHeader = () => {
    setCollapsedHeader(!collapsedHeader);
  };

  if (isLoading) {
    return <Loading label="Carregando usuários bloqueados..." />;
  }

  return (
    <Container>
      <PageHeader
        title="Usuários Bloqueados"
        description="Gerencie todos os usuários bloqueados no sistema."
        collapsed={collapsedHeader}
        toggle={toggleHeader}
        button={
          <div className="flex items-center gap-4">
            {canBlockUsers && (
              <Button
                onClick={openModal}
                icon={<Plus className="h-5 w-5" />}
                label="Bloquear Usuário"
              />
            )}
            <ToggleHeaderButton
              toggle={toggleHeader}
              collapsed={collapsedHeader}
            />
          </div>
        }
      />
      <Error error={error} clear={clearError} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden p-6"
      >
        {blockedUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-800">
              Nenhum usuário bloqueado encontrado
            </h3>
            {canBlockUsers && (
              <motion.button
                onClick={openModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-5 w-5" />
                Bloquear Usuário
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
                  Mostrando {blockedUsers.length} de {totalBlockedUsers}{' '}
                  resultados
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
                  <BlockedUserTable
                    blockedUsers={blockedUsers}
                    canViewDetails={canViewDetails}
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
                  <BlockedUserCards
                    blockedUsers={blockedUsers}
                    canViewDetails={canViewDetails}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Mostrar</span>
                <select
                  title="Selecionar Itens Por Página"
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
                totalItems={totalBlockedUsers}
                perPage={perPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </motion.div>

      {canBlockUsers && (
        <BlockUserModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </Container>
  );
}
