import { motion } from 'framer-motion';

interface TopProductsTableProps {
  data: {
    name: string;
    sales: number;
    revenue: number;
  }[];
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
}

export function TopProductsTable({
  data,
  formatCurrency,
  formatNumber,
}: TopProductsTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-sm h-80 flex items-center justify-center">
        <p className="text-text-secondary">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-surface p-6 rounded-xl shadow-sm"
    >
      <h3 className="text-lg font-medium mb-6">Produtos Mais Vendidos</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-100">
              <th className="pb-3 pl-2">#</th>
              <th className="pb-3 pl-2">Produto</th>
              <th className="pb-3">Vendas</th>
              <th className="pb-3">Receita</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr
                key={product.name}
                className="border-b border-gray-50 hover:bg-gray-50/50"
              >
                <td className="py-3 pl-2 text-text-secondary">{index + 1}</td>
                <td className="py-3 pl-2 font-medium">{product.name}</td>
                <td className="py-3">{formatNumber(product.sales)}</td>
                <td className="py-3 font-medium">
                  {formatCurrency(product.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
