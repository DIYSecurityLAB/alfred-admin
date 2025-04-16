import React from "react";
import { Search, FilterX, Calendar, Download, Loader } from "lucide-react";

interface ReportFiltersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (filters: Partial<any>) => void;
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
  exportProgress = "",
}: ReportFiltersProps) {
  const [startDate, setStartDate] = React.useState<string>(
    filters.startAt || ""
  );
  const [endDate, setEndDate] = React.useState<string>(filters.endAt || "");

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (e.target.value) {
      // Convertendo formato yyyy-MM-dd para dd-MM-yyyy para API
      const [year, month, day] = e.target.value.split("-");
      onFilterChange({ startAt: `${day}-${month}-${year}` });
    } else {
      onFilterChange({ startAt: undefined });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (e.target.value) {
      // Convertendo formato yyyy-MM-dd para dd-MM-yyyy para API
      const [year, month, day] = e.target.value.split("-");
      onFilterChange({ endAt: `${day}-${month}-${year}` });
    } else {
      onFilterChange({ endAt: undefined });
    }
  };

  const handleExportClick = async () => {
    await onExportToExcel();
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-md border border-blue-50 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px] group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 transition-all duration-300 group-hover:text-blue-500" />
            <input
              type="text"
              placeholder="Buscar por usuário..."
              value={filters.username || ""}
              onChange={(e) =>
                onFilterChange({ username: e.target.value || undefined })
              }
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={filters.status || ""}
              onChange={(e) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onFilterChange({ status: (e.target.value as any) || undefined })
              }
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
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
              value={filters.paymentMethod || ""}
              onChange={(e) =>
                onFilterChange({
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  paymentMethod: (e.target.value as any) || undefined,
                })
              }
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300 appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
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
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300 border border-gray-200 transform hover:-translate-y-1 shadow-sm hover:shadow"
            title="Limpar filtros"
          >
            <FilterX className="h-5 w-5" />
            <span className="hidden md:inline">Limpar</span>
          </button>

          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 disabled:opacity-70 transform hover:-translate-y-1 shadow-sm hover:shadow disabled:hover:transform-none"
            title="Exportar para Excel"
          >
            {isExporting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span className="hidden md:inline">
                  {exportProgress || "Exportando..."}
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

        <div className="flex flex-wrap gap-4 items-center mt-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-gray-600 font-medium">Período:</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
                placeholder="Data inicial"
              />
            </div>

            <div className="w-full md:w-auto">
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
                placeholder="Data final"
              />
            </div>
          </div>
        </div>
      </div>

      {isExporting && (
        <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100 animate-pulse">
          <p>
            Isso pode levar algum tempo se houver muitos registros. Por favor,
            aguarde...
          </p>
        </div>
      )}
    </div>
  );
}
