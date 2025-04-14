import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { motion } from 'framer-motion';

interface PaymentMethodsChartProps {
  data: {
    method: string;
    count: number;
    value: number;
  }[];
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
}

export function PaymentMethodsChart({
  data,
  formatCurrency,
  formatNumber,
}: PaymentMethodsChartProps) {
  const [chartType, setChartType] = useState<'count' | 'value'>('count');
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-sm h-80 flex items-center justify-center">
        <p className="text-text-secondary">Nenhum dado disponível</p>
      </div>
    );
  }

  const formatMethodName = (method: string) => {
    switch (method) {
      case 'PIX':
        return 'PIX';
      case 'CREDIT_CARD':
        return 'Cartão';
      case 'CRYPTO':
        return 'Cripto';
      case 'BANK_TRANSFER':
        return 'Transf.';
      default:
        return method;
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-surface rounded-md shadow-md">
          <p className="font-medium">{getFullMethodName(label)}</p>
          {chartType === 'count' ? (
            <p className="text-primary font-bold">{formatNumber(payload[0].value as number)} transações</p>
          ) : (
            <p className="text-primary font-bold">{formatCurrency(payload[0].value as number)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const getFullMethodName = (method: string) => {
    switch (method) {
      case 'PIX':
        return 'PIX';
      case 'CREDIT_CARD':
        return 'Cartão de Crédito';
      case 'CRYPTO':
        return 'Criptomoeda';
      case 'BANK_TRANSFER':
        return 'Transferência Bancária';
      default:
        return method;
    }
  };

  // Preparar os dados para o gráfico
  const chartData = data.map(item => ({
    method: formatMethodName(item.method),
    [chartType]: chartType === 'count' ? item.count : item.value,
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface p-6 rounded-xl shadow-sm"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-lg font-medium">Métodos de Pagamento</h3>
        <div className="flex mt-2 md:mt-0 gap-1 bg-background rounded-lg p-1">
          <button
            onClick={() => setChartType('count')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'count'
                ? 'bg-primary text-white'
                : 'hover:bg-primary/10'
            }`}
          >
            Quantidade
          </button>
          <button
            onClick={() => setChartType('value')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'value'
                ? 'bg-primary text-white'
                : 'hover:bg-primary/10'
            }`}
          >
            Valor
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="method" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => 
                chartType === 'value' 
                  ? `R$${value/1000}k` 
                  : value
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={chartType} 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
