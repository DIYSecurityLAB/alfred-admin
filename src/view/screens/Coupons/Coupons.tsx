import { Pagination } from "@/components/Pagination";
import { useCoupons } from "@/view/screens/Coupons/useCoupons";
import { AnimatePresence } from "framer-motion";
import { Plus, AlertCircle, X } from "lucide-react";
import { CouponCards } from "./partials/CouponCards";
import { CouponDetailsModal } from "./partials/CouponDetailsModal";
import { CouponFilters } from "./partials/CouponFilters";
import { CouponModal } from "./partials/CouponModal";
import { CouponTable } from "./partials/CouponTable";

export function Coupons() {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Carregando cupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cupons</h1>
          <p className="text-text-secondary mt-1">
            Gerencie todos os cupons de desconto
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Novo Cupom
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Erro</p>
            <p>{error}</p>
          </div>
          <button
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
        <CouponFilters filters={filters} onFilterChange={handleFilterChange} />
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray/10 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              Nenhum cupom encontrado
            </h3>
            <p className="text-white text-center max-w-md mb-6">
              {filters.code || filters.status !== "all"
                ? "Nenhum cupom corresponde aos filtros selecionados. Tente ajustar seus filtros."
                : "Você ainda não criou nenhum cupom. Comece criando seu primeiro cupom de desconto!"}
            </p>
            <button
              onClick={openCreateModal}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Criar Cupom
            </button>
          </div>
        ) : (
          <>
            <div className="hidden lg:block mb-6">
              <CouponTable
                coupons={coupons}
                onViewDetails={openDetailsModal}
                onEdit={openEditModal}
                onToggleStatus={toggleCouponStatus}
              />
            </div>
            <div className="lg:hidden mb-6">
              <CouponCards
                coupons={coupons}
                onViewDetails={openDetailsModal}
                onEdit={openEditModal}
                onToggleStatus={toggleCouponStatus}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Mostrar</span>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-text-secondary">
                  itens por página
                </span>
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
      </div>
      <AnimatePresence mode="wait">
        {isCreateModalOpen && (
          <CouponModal
            key="create-modal"
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={async (data) => {
              await createCoupon(data);
            }}
          />
        )}
        {isEditModalOpen && selectedCoupon && (
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
            onEdit={() => {
              setIsDetailsModalOpen(false);
              setIsEditModalOpen(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
