import React from 'react';
import { Search, FilterX, Calendar, Download, Loader } from 'lucide-react';
import type { DepositFilter } from '../../../data/types';

interface ReportFiltersProps {
  filters: DepositFilter;
  onFilterChange: (filters: Partial<DepositFilter>) => void;
  onClearFilters: () => void;
  onExportToExcel: () => Promise<boolean>;
  isExporting?: boolean;
  exportProgress?: string;
}

export function ReportFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  onExportToExcel,
  isExporting = false,
  exportProgress = ''
}: ReportFiltersProps) {
  const [startDate, setStartDate] = React.useState<string>(filters.startAt || '');
  const [endDate, setEndDate] = React.useState<string>(filters.endAt || '');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (e.target.value) {
      // Convertendo formato yyyy-MM-dd para dd-MM-yyyy para API
      const [year, month, day] = e.target.value.split('-');
      onFilterChange({ startAt: `${day}-${month}-${year}` });
    } else {
      onFilterChange({ startAt: undefined });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (e.target.value) {
      // Convertendo formato yyyy-MM-dd para dd-MM-yyyy para API
      const [year, month, day] = e.target.value.split('-');
      onFilterChange({ endAt: `${day}-${month}-${year}` });
    } else {
      onFilterChange({ endAt: undefined });
    }
  };

  const handleExportClick = async () => {
    await onExportToExcel();
  };

  return (
    <div className="bg-surface rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar por usuário..."
              value={filters.username || ''}
              onChange={(e) => onFilterChange({ username: e.target.value || undefined })}
              className="w-full pl-10 pr-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value as any || undefined })}
              className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
            >
              <option value="">Todos os status</option>
              <option value="PENDING">Pendente</option>
              <option value="pending">Pendente</option>
              <option value="COMPLETED">Completado</option>
              <option value="complete">Completado</option>
              <option value="paid">Pago</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="canceled">Cancelado</option>
              <option value="FAILED">Falhou</option>
              <option value="expired">Expirado</option>
              <option value="refunded">Reembolsado</option>
              <option value="review">Em Revisão</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={filters.paymentMethod || ''}
              onChange={(e) => onFilterChange({ paymentMethod: e.target.value as any || undefined })}
              className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
            >
              <option value="">Todos os métodos</option>
              <option value="PIX">PIX</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="CARD">Cartão</option>
              <option value="CRYPTO">Criptomoeda</option>
              <option value="BANK_TRANSFER">Transferência Bancária</option>
              <option value="WISE">Wise</option>
              <option value="TICKET">Boleto</option>
              <option value="USDT">USDT</option>
              <option value="SWIFT">Swift</option>
              <option value="PAYPAL">PayPal</option>
            </select>
          </div>

          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-background hover:bg-primary/10 transition-colors"
            title="Limpar filtros"
          >
            <FilterX className="h-5 w-5" />
            <span className="hidden md:inline">Limpar</span>
          </button>

          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-70"
            title="Exportar para Excel"
          >
            {isExporting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span className="hidden md:inline">
                  {exportProgress || 'Exportando...'}
                </span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span className="hidden md:inline">Exportar Excel</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-text-secondary" />
            <span className="text-text-secondary">Período:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                placeholder="Data inicial"
              />
            </div>
            
            <div className="w-full md:w-auto">
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
                placeholder="Data final"
              />
            </div>
          </div>
        </div>
      </div>
      
      {isExporting && (
        <div className="mt-4 text-sm text-text-secondary">
          <p>Isso pode levar algum tempo se houver muitos registros. Por favor, aguarde...</p>
        </div>
      )}
    </div>
  );
}
