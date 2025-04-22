import { Pagination } from '@/components/Pagination';
import { Button } from '@/view/components/Button';
import { Container } from '@/view/components/Container';
import { Error } from '@/view/components/Error';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ToggleHeaderButton } from '@/view/layout/Page/ToggleHeaderButton';
import { motion } from 'framer-motion';
import { AlertCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import { BlockedUserTable } from './partials/table';
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

  const [collapsedHeader, setCollapsedHeader] = useState(false);

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
        description="Gerencie todos os usuários bloqueados no sistema"
        collapsed={collapsedHeader}
        toggle={toggleHeader}
        button={
          <div className="flex items-center gap-4">
            <Button
              open={() => {}}
              icon={<Plus className="h-5 w-5" />}
              label="Bloquear Usuário"
            />
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
        {blockedUsers.length === 0 && (
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
            <motion.button
              onClick={() => {}}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-5 w-5" />
              Bloquear Usuário
            </motion.button>
          </motion.div>
        )}

        {blockedUsers.length >= 1 && (
          <>
            <div className="hidden lg:block mb-6">
              <BlockedUserTable blockedUsers={blockedUsers} />
            </div>
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
    </Container>
  );
}
