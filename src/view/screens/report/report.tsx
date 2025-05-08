import { Pagination } from '@/components/Pagination';
import { ReportedDeposit } from '@/domain/entities/report.entity';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/models/permissions';
import { Container } from '@/view/components/Container';
import { Error } from '@/view/components/Error';
import { Loading } from '@/view/components/Loading';
import { PageHeader } from '@/view/layout/Page/PageHeader';
import { ROUTES } from '@/view/routes/Routes';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, LayoutDashboard, LayoutGrid, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReportCards } from './partials/Cards';
import { ReportFilters } from './partials/Filters';
import { ReportTable } from './partials/Table';
import { useReport } from './useReport';
export function Reports() {
  const { hasPermission } = useAuth();
  const canExport = hasPermission(Permission.REPORTS_EXPORT);
  const canViewDetails = true;
  const canManageSales = hasPermission(Permission.SALES_MANAGE);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [exportPercent, setExportPercent] = useState<number>(0);
  const [collapsedHeader, setCollapsedHeader] = useState(false);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

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

  type Filters = Record<string, string | number | null>;

  const handleFilterChangeWithUrl = (newFilters: Filters) => {
    const updatedFilters = { ...filters, ...newFilters };

    clearFilters();

    // Remove filtros inválidos e garante que os valores sejam strings
    const validFilters = Object.fromEntries(
      Object.entries(updatedFilters)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)]),
    );

    const params = new URLSearchParams(validFilters as Record<string, string>);
    setSearchParams(params);

    handleFilterChange(validFilters);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [refetch]);

  useEffect(() => {
    const urlFilters = Object.fromEntries(searchParams.entries());
    const areFiltersDifferent =
      JSON.stringify(filters) !== JSON.stringify(urlFilters);

    if (areFiltersDifferent) {
      handleFilterChange(urlFilters);
    }
  }, [searchParams]);

  const openDepositDetails = (report: ReportedDeposit) => {
    navigate(ROUTES.sales.details.call(report.id));
  };

  const handleExportToExcel = async (): Promise<boolean> => {
    if (!canExport) return false;

    setIsExporting(true);
    setExportProgress('Iniciando exportação...');
    setExportPercent(0);

    try {
      // Passamos a função de callback para atualizar o progresso
      const result = await exportToExcel((message, percent) => {
        setExportProgress(message);
        setExportPercent(percent);
      });

      // Se chegou até aqui, a exportação foi bem-sucedida
      if (result) {
        // Mantemos a mensagem de sucesso visível por alguns segundos
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress('');
          setExportPercent(0);
        }, 3000);
      } else {
        // Se houve erro, limpa imediatamente
        setIsExporting(false);
        setExportProgress('');
        setExportPercent(0);
      }

      return result === true;
    } catch (error) {
      console.error('Erro durante exportação:', error);
      setIsExporting(false);
      setExportProgress('');
      setExportPercent(0);
      return false;
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
      />

      <Error error={error} clear={clearError} />

      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChangeWithUrl}
        onClearFilters={clearFilters}
        onExportToExcel={handleExportToExcel}
        isExporting={isExporting}
        exportProgress={exportProgress}
        exportPercent={exportPercent}
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
