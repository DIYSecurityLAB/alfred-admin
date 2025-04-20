import { motion } from 'framer-motion';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';

interface TransactionStatusChartProps {
  data: {
    status: string;
    count: number;
  }[];
  formatNumber: (value: number) => string;
}

export function TransactionStatusChart({
  data,
  formatNumber,
}: TransactionStatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-sm h-80 flex items-center justify-center">
        <p className="text-text-secondary">Nenhum dado disponível</p>
      </div>
    );
  }

  const COLORS = [
    '#4ade80', // complete
    '#facc15', // pending
    '#ef4444', // canceled
    '#a855f7', // review
    '#3b82f6', // paid
    '#94a3b8', // expired
    '#fb923c', // refunded
  ];

  const statusLabels: Record<string, string> = {
    complete: 'Completo',
    pending: 'Pendente',
    canceled: 'Cancelado',
    review: 'Em revisão',
    paid: 'Pago',
    expired: 'Expirado',
    refunded: 'Reembolsado',
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border border-surface rounded-md shadow-md">
          <p className="font-medium">{statusLabels[data.status]}</p>
          <p className="text-primary font-bold">
            {formatNumber(data.count)} transações
          </p>
          <p className="text-sm text-text-secondary">
            {((data.count / totalCount) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface p-6 rounded-xl shadow-sm"
    >
      <h3 className="text-lg font-medium mb-6">Status das Transações</h3>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => statusLabels[value] || value}
              layout="horizontal"
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
