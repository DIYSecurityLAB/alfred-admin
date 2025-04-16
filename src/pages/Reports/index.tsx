import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LayoutGrid,
  Loader,
  AlertCircle,
  X,
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react";
import { useReports } from "../../hooks/useReports";
import { ReportFilters } from "./components/ReportFilters";
import { ReportTable } from "./components/ReportTable";
import { ReportCards } from "./components/ReportCards";
import { ReportDetailsModal } from "./components/ReportDetailsModal";
import { Pagination } from "../../components/Pagination";

export function Reports() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>("");
  const [collapsedHeader, setCollapsedHeader] = useState(false);

  const {
    reports,
    totalReports,
    totalPages,
    page,
    filters,
    isLoading,
    error,
    selectedReport,
    isDetailsModalOpen,
    viewMode,
    handlePageChange,
    handleFilterChange,
    openDetailsModal,
    setIsDetailsModalOpen,
    setViewMode,
    clearFilters,
    clearError,
    exportToExcel,
  } = useReports();

  const handleExportToExcel = async () => {
    setIsExporting(true);
    setExportProgress("Iniciando exportação...");
    try {
      setTimeout(() => {
        if (isExporting) setExportProgress("Buscando dados do servidor...");
      }, 1000);

      setTimeout(() => {
        if (isExporting)
          setExportProgress("Processando dados para exportação...");
      }, 5000);

      setTimeout(() => {
        if (isExporting) setExportProgress("Gerando arquivo Excel...");
      }, 10000);

      return await exportToExcel();
    } finally {
      setIsExporting(false);
      setExportProgress("");
    }
  };

  const toggleHeader = () => {
    setCollapsedHeader(!collapsedHeader);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className={`bg-white rounded-lg shadow-md border border-blue-50 p-6 mb-8 transition-all duration-500 ${
          collapsedHeader ? "cursor-pointer" : ""
        }`}
        variants={itemVariants}
        onClick={collapsedHeader ? toggleHeader : undefined}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              Relatórios de Depósitos
            </h1>
            {!collapsedHeader && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-gray-600">
                  Visualize e exporte relatórios de todos os depósitos
                  realizados.
                </p>
              </motion.div>
            )}
          </div>
          <button
            onClick={toggleHeader}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {collapsedHeader ? (
              <ChevronDown className="h-5 w-5 text-blue-500" />
            ) : (
              <ChevronUp className="h-5 w-5 text-blue-500" />
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {!collapsedHeader && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ReportFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              onExportToExcel={handleExportToExcel}
              isExporting={isExporting}
              exportProgress={exportProgress}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>

      <motion.div
        className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <span className="text-gray-700">
            {totalReports === 0
              ? "Nenhum resultado encontrado"
              : `Mostrando ${reports.length} de ${totalReports} resultados`}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === "table"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 hover:bg-blue-100 text-gray-700 hover:shadow-sm"
            }`}
            title="Visualizar em tabela"
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>

          <button
            onClick={() => setViewMode("cards")}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === "cards"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 hover:bg-blue-100 text-gray-700 hover:shadow-sm"
            }`}
            title="Visualizar em cards"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            className="flex flex-col justify-center items-center py-16 bg-white rounded-lg shadow-md border border-blue-50"
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Carregando dados...</p>
          </motion.div>
        ) : reports.length === 0 ? (
          <motion.div
            className="bg-white rounded-lg p-10 text-center shadow-md border border-blue-50"
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-gray-600 text-lg">
              Nenhum depósito encontrado com os filtros atuais.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {viewMode === "table" ? (
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
                variants={itemVariants}
              >
                <ReportTable
                  reports={reports}
                  onViewDetails={openDetailsModal}
                />
              </motion.div>
            ) : (
              <motion.div className="mb-6" variants={itemVariants}>
                <ReportCards
                  reports={reports}
                  onViewDetails={openDetailsModal}
                />
              </motion.div>
            )}

            <motion.div className="pt-4" variants={itemVariants}>
              <Pagination
                currentPage={page}
                totalPages={totalPages || 1}
                onPageChange={handlePageChange}
                siblingCount={1}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDetailsModalOpen && selectedReport && (
          <ReportDetailsModal
            report={selectedReport}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
