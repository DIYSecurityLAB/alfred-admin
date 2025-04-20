import {
  AlertCircle,
  Clock,
  CreditCard,
  DollarSign,
  Package2,
  Tags,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { PaymentMethodsChart } from './components/PaymentMethodsChart';
import { RevenueChart } from './components/RevenueChart';
import { StatCard } from './components/StatCard';
import { TopProductsTable } from './components/TopProductsTable';
import { TransactionStatusChart } from './components/TransactionStatusChart';
import { UserRegistrationChart } from './components/UserRegistrationChart';

export function Dashboard() {
  const {
    stats,
    isLoading,
    error,
    dateRange,
    setDateRange,
    formatCurrency,
    formatNumber,
    formatPercentage,
    clearError,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4 inline-flex">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">
            Erro ao carregar os dados da dashboard.
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={clearError}
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Visão geral de métricas e vendas
        </p>
      </div>

      {/* Cards Estatísticos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Vendas Totais"
          value={formatNumber(stats.totalSales)}
          icon={<Package2 className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          delay={0}
        />

        <StatCard
          title="Receita Total"
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          delay={1}
        />

        <StatCard
          title="Usuários"
          value={formatNumber(stats.totalUsers)}
          change={
            stats.newUsers > 0 ? (stats.newUsers / stats.totalUsers) * 100 : 0
          }
          changeLabel="novos este mês"
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          delay={2}
        />

        <StatCard
          title="Cupons Ativos"
          value={formatNumber(stats.activeCoupons)}
          icon={<Tags className="h-5 w-5" />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          delay={3}
        />
      </div>

      {/* Segunda linha de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Transações Pendentes"
          value={formatNumber(stats.pendingTransactions)}
          icon={<Clock className="h-5 w-5" />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          delay={4}
        />

        <StatCard
          title="Método + Utilizado"
          value="PIX"
          icon={<CreditCard className="h-5 w-5" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          delay={5}
        />

        <StatCard
          title="Taxa de Conversão"
          value={formatPercentage(stats.conversionRate)}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          delay={6}
        />

        <StatCard
          title="Valor Médio"
          value={formatCurrency(stats.totalRevenue / stats.totalSales)}
          icon={<Wallet className="h-5 w-5" />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          delay={7}
        />
      </div>

      {/* Gráfico principal */}
      <RevenueChart
        data={stats.revenueByDay}
        dateRange={dateRange}
        setDateRange={setDateRange}
        formatCurrency={formatCurrency}
      />

      {/* Gráficos secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodsChart
          data={stats.salesByPaymentMethod}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />

        <TransactionStatusChart
          data={stats.transactionsByStatus}
          formatNumber={formatNumber}
        />
      </div>

      {/* Linha final */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserRegistrationChart
          data={stats.userRegistrationByMonth}
          formatNumber={formatNumber}
        />

        <TopProductsTable
          data={stats.topProducts}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
}
