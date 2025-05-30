import { Pagination } from '@/components/Pagination';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/models/permissions';
import { Container } from '@/view/components/Container';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { useCoupons } from '@/view/screens/Coupons/useCoupons';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { CouponCards } from './partials/CouponCards';
import { CouponDetailsModal } from './partials/CouponDetailsModal';
import { CouponFilters } from './partials/CouponFilters';
import { CouponModal } from './partials/CouponModal';
import { CouponTable } from './partials/CouponTable';

export function Coupons() {
  const { hasPermission } = useAuth();
  const canCreateCoupons = hasPermission(Permission.COUPONS_CREATE);
  const canEditCoupons = hasPermission(Permission.COUPONS_EDIT);

  const {
    coupons,
    totalCoupons,
    page,
    perPage,
    filters,
    isLoading,
    error,
    selectedCoupon,
    isCreateModalOpen,
    isEditModalOpen,
    isDetailsModalOpen,
    handlePageChange,
    handleFilterChange,
    setPerPage,
    openCreateModal,
    openEditModal,
    openDetailsModal,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setIsDetailsModalOpen,
    createCoupon,
    updateCoupon,
    toggleCouponStatus,
    clearError,
  } = useCoupons();

  const [collapsedHeader, setCollapsedHeader] = useState(false);

  const toggleHeader = () => {
    setCollapsedHeader(!collapsedHeader);
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return <Loading label="Carregando cupons..." />;
  }

  return (
    <Container>
      <PageHeader
        title="Cupons"
        description="Gerencie todos os cupons de desconto."
        button={
          canCreateCoupons && (
            <motion.button
              onClick={openCreateModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-5 w-5" />
              Novo Cupom
            </motion.button>
          )
        }
        collapsed={collapsedHeader}
        toggle={toggleHeader}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden p-6 space-y-8"
      >
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 shadow-sm"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        <CouponFilters filters={filters} onFilterChange={handleFilterChange} />

        {coupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-800">
              Nenhum cupom encontrado
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {filters.code || filters.status !== 'all'
                ? 'Nenhum cupom corresponde aos filtros selecionados. Tente ajustar seus filtros.'
                : 'Você ainda não criou nenhum cupom. Comece criando seu primeiro cupom de desconto!'}
            </p>
            {canCreateCoupons && (
              <motion.button
                onClick={openCreateModal}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-5 w-5" />
                Criar Cupom
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="hidden lg:block mb-6">
              <CouponTable
                coupons={coupons}
                onViewDetails={openDetailsModal}
                onEdit={openEditModal}
                onToggleStatus={toggleCouponStatus}
                canEdit={canEditCoupons}
              />
            </div>
            <div className="lg:hidden mb-6">
              <CouponCards
                coupons={coupons}
                onViewDetails={openDetailsModal}
                onEdit={openEditModal}
                onToggleStatus={toggleCouponStatus}
                canEdit={canEditCoupons}
              />
            </div>
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
                totalItems={totalCoupons}
                perPage={perPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isCreateModalOpen && canCreateCoupons && (
          <CouponModal
            key="create-modal"
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={async (data) => {
              await createCoupon({ ...data, usedCount: 0 });
            }}
          />
        )}
        {isEditModalOpen && selectedCoupon && canEditCoupons && (
          <CouponModal
            key="edit-modal"
            coupon={selectedCoupon}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={async (data) => {
              await updateCoupon({ id: selectedCoupon.id, data });
            }}
          />
        )}
        {isDetailsModalOpen && selectedCoupon && (
          <CouponDetailsModal
            key="details-modal"
            coupon={selectedCoupon}
            onClose={() => setIsDetailsModalOpen(false)}
            onEdit={
              canEditCoupons
                ? () => {
                    setIsDetailsModalOpen(false);
                    setIsEditModalOpen(true);
                  }
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </Container>
  );
}
