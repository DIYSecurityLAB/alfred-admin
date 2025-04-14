import React from 'react';
import { Search, FilterX, Calendar } from 'lucide-react';
import type { TransactionFilter, TransactionStatus, PaymentMethod } from '../../../data/types';

interface TransactionFiltersProps {
  filters: TransactionFilter;
  onFilterChange: (filters: Partial<TransactionFilter>) => void;
}

export function TransactionFilters({ filters, onFilterChange }: TransactionFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      transactionId: '',
      status: 'all',
      paymentMethod: 'all',
      dateRange: undefined
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const dateRange = filters.dateRange || { start: '', end: '' };
    onFilterChange({ 
      dateRange: { 
        ...dateRange, 
        [field]: value 
      } 
    });
  };

  return (
    <div className="bg-surface rounded-lg p-4 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar por ID da transação..."
            value={filters.transactionId || ''}
            onChange={(e) => onFilterChange({ transactionId: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <select
              value={filters.status === 'all' ? 'all' : filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value === 'all' ? 'all' : e.target.value as TransactionStatus })}
              className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="canceled">Cancelado</option>
              <option value="review">Em revisão</option>
              <option value="expired">Expirado</option>
              <option value="refunded">Reembolsado</option>
              <option value="complete">Completo</option>
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <select
              value={filters.paymentMethod === 'all' ? 'all' : filters.paymentMethod}
              onChange={(e) => onFilterChange({ paymentMethod: e.target.value === 'all' ? 'all' : e.target.value as PaymentMethod })}
              className="w-full px-4 py-2.5 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
            >
              <option value="all">Todos os métodos</option>
              <option value="PIX">PIX</option>
              <option value="CREDIT_CARD">Cartão de crédito</option>
              <option value="CRYPTO">Criptomoeda</option>
              <option value="BANK_TRANSFER">Transferência bancária</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="flex flex-1 items-center gap-2">
          <Calendar className="h-5 w-5 text-text-secondary" />
          <span className="text-sm">De:</span>
          <input
            type="date"
            value={filters.dateRange?.start || ''}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            className="w-full px-4 py-2 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-1 items-center gap-2">
          <Calendar className="h-5 w-5 text-text-secondary" />
          <span className="text-sm">Até:</span>
          <input
            type="date"
            value={filters.dateRange?.end || ''}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            className="w-full px-4 py-2 bg-background rounded-lg border border-surface focus:outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background hover:bg-primary/10 transition-colors"
          title="Limpar filtros"
        >
          <FilterX className="h-5 w-5" />
          <span>Limpar</span>
        </button>
      </div>
    </div>
  );
}
