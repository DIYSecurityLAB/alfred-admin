import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';

interface UserRegistrationChartProps {
  data: {
    month: string;
    count: number;
  }[];
  formatNumber: (value: number) => string;
}

export function UserRegistrationChart({
  data,
  formatNumber,
}: UserRegistrationChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-sm h-80 flex items-center justify-center">
        <p className="text-text-secondary">Nenhum dado disponível</p>
      </div>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-surface rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-primary font-bold">
            {formatNumber(payload[0].value as number)} usuários
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-surface p-6 rounded-xl shadow-sm"
    >
      <h3 className="text-lg font-medium mb-6">Novos Usuários por Mês</h3>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, left: 0, bottom: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: 'white' }}
              activeDot={{
                r: 6,
                stroke: '#3b82f6',
                strokeWidth: 2,
                fill: '#3b82f6',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
