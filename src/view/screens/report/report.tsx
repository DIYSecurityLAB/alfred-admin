import { Pagination } from '@/components/Pagination';
import { ReportedDeposit } from '@/domain/entities/report.entity';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/models/permissions';
import { Container } from '@/view/components/Container';
import { Error } from '@/view/components/Error';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ToggleHeaderButton } from '@/view/layout/Page/ToggleHeaderButton';
import { ROUTES } from '@/view/routes/Routes';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  Loader,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportCards } from './partials/Cards';
import { ReportFilters } from './partials/Filters';
import { ReportTable } from './partials/Table';
import { useReport } from './useReport';

export function Reports() {
  const { hasPermission } = useAuth();
  const canExport = hasPermission(Permission.REPORTS_EXPORT);
  const canViewDetails = true; // Todos que podem acessar Reports podem ver detalhes
  const canManageSales = hasPermission(Permission.SALES_MANAGE);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [collapsedHeader, setCollapsedHeader] = useState(false);
  const navigate = useNavigate();

  const {
    reports,
    totalReports,
    page,
    perPage,
    filters,
    isLoading,
    error,
    viewMode,
    handlePageChange,
    handleFilterChange,
    setPerPage,
    setViewMode,
    clearFilters,
    clearError,
    exportToExcel,
    refetch,
  } = useReport();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [refetch]);

  const openDepositDetails = (report: ReportedDeposit) => {
    navigate(ROUTES.sales.details.call(report.id));
  };

  const handleExportToExcel = async () => {
    if (!canExport) return;

    setIsExporting(true);
    setExportProgress('Iniciando exportação...');
    try {
      setTimeout(() => {
        if (isExporting) setExportProgress('Buscando dados do servidor...');
      }, 1000);

      setTimeout(() => {
        if (isExporting)
          setExportProgress('Processando dados para exportação...');
      }, 5000);

      setTimeout(() => {
        if (isExporting) setExportProgress('Gerando arquivo Excel...');
      }, 10000);

      return await exportToExcel();
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const toggleHeader = () => {
    setCollapsedHeader(!collapsedHeader);
  };

  if (isLoading && reports.length === 0) {
    return <Loading label="Carregando relatórios de depósitos..." />;
  }

  return (
    <Container>
      <PageHeader
        title="Relatórios de Depósitos"
        description="Visualize e exporte relatórios de todos os depósitos realizados."
        collapsed={collapsedHeader}
        toggle={toggleHeader}
        button={
          <div className="flex items-center gap-4">
            {canExport && (
              <button
                onClick={handleExportToExcel}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white rounded-lg transition-colors shadow-sm hover:shadow"
              >
                {isExporting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Exportando...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    <span>Exportar Excel</span>
                  </>
                )}
              </button>
            )}
            <ToggleHeaderButton
              toggle={toggleHeader}
              collapsed={collapsedHeader}
            />
          </div>
        }
      />

      <Error error={error} clear={clearError} />

      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onExportToExcel={handleExportToExcel}
        isExporting={isExporting}
        exportProgress={exportProgress}
        canExport={canExport}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden p-6"
      >
        {isLoading && reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Carregando dados...</p>
          </div>
        ) : reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-800">
              Nenhum depósito encontrado
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {Object.keys(filters).length > 0
                ? 'Nenhum depósito corresponde aos filtros selecionados. Tente ajustar seus filtros.'
                : 'Não há depósitos registrados no sistema.'}
            </p>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Limpar filtros
              </button>
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
                  Mostrando {reports.length} de {totalReports} resultados
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
                  <ReportTable
                    reports={reports}
                    onViewDetails={openDepositDetails}
                    canViewDetails={canViewDetails}
                    canManageSales={canManageSales}
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
                  <ReportCards
                    reports={reports}
                    onViewDetails={openDepositDetails}
                    canViewDetails={canViewDetails}
                    canManageSales={canManageSales}
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
                totalItems={totalReports}
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
