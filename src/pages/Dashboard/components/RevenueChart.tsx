import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
  dateRange: 'day' | 'week' | 'month' | 'year';
  setDateRange: (range: 'day' | 'week' | 'month' | 'year') => void;
  formatCurrency: (value: number) => string;
}

export function RevenueChart({
  data,
  dateRange,
  setDateRange,
  formatCurrency,
}: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-sm h-96 flex items-center justify-center">
        <p className="text-text-secondary">Nenhum dado disponível</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-surface rounded-md shadow-md">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-primary font-bold">
            {formatCurrency(payload[0].value as number)}
          </p>
        </div>
      );
    }
    return null;
  };

  const ranges = [
    { key: 'day', label: '1D' },
    { key: 'week', label: '7D' },
    { key: 'month', label: '30D' },
    { key: 'year', label: '1A' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface p-6 rounded-xl shadow-sm"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-lg font-medium">Receitas</h3>
        <div className="flex mt-2 md:mt-0 gap-1 bg-background rounded-lg p-1">
          {ranges.map((range) => (
            <button
              key={range.key}
              onClick={() => setDateRange(range.key)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                dateRange === range.key
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary/10'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `R$${value / 1000}k`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
