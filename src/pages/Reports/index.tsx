import React, { useState } from 'react';
import { LayoutDashboard, LayoutGrid, Loader, AlertCircle, X } from 'lucide-react';
import { useReports } from '../../hooks/useReports';
import { ReportFilters } from './components/ReportFilters';
import { ReportTable } from './components/ReportTable';
import { ReportCards } from './components/ReportCards';
import { ReportDetailsModal } from './components/ReportDetailsModal';
import { Pagination } from '../../components/Pagination';

export function Reports() {
  const [isExporting, setIsExporting] = useState(false);
  const {
    reports,
    totalReports,
    totalPages,
    page,
    pageSize,
    filters,
    isLoading,
    error,
    selectedReport,
    isDetailsModalOpen,
    viewMode,
    handlePageChange,
    handleFilterChange,
    setPageSize,
    openDetailsModal,
    setIsDetailsModalOpen,
    setViewMode,
    clearFilters,
    clearError,
    exportToExcel,
  } = useReports();

  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      return await exportToExcel(); // Agora retorna o resultado booleano
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Relatórios de Depósitos</h1>
        <p className="text-text-secondary">Visualize e exporte relatórios de todos os depósitos realizados.</p>
      </div>

      <ReportFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onClearFilters={clearFilters}
        onExportToExcel={handleExportToExcel}
        isExporting={isExporting}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-900 rounded-lg flex items-center text-red-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button 
            onClick={clearError}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">
            {totalReports === 0 ? 'Nenhum resultado encontrado' : 
            `Mostrando ${reports.length} de ${totalReports} resultados`}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table' 
                ? 'bg-primary text-white' 
                : 'bg-background hover:bg-primary/10'
            }`}
            title="Visualizar em tabela"
          >
            <LayoutDashboard className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'cards' 
                ? 'bg-primary text-white' 
                : 'bg-background hover:bg-primary/10'
            }`}
            title="Visualizar em cards"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader className="h-10 w-10 text-primary animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-surface rounded-lg p-10 text-center">
          <p className="text-text-secondary text-lg">Nenhum depósito encontrado com os filtros atuais.</p>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <div className="bg-surface rounded-lg shadow-sm overflow-hidden mb-6">
              <ReportTable 
                reports={reports} 
                onViewDetails={openDetailsModal} 
              />
            </div>
          ) : (
            <div className="mb-6">
              <ReportCards 
                reports={reports} 
                onViewDetails={openDetailsModal} 
              />
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
            siblingCount={1}
          />
        </>
      )}

      {isDetailsModalOpen && selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
