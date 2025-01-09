import React from 'react';
import { formatCurrency } from '@/utils/stockCalculations';
import type { EstoqueSummary } from '@/services/estoqueService';

interface EstoqueTableProps {
  data: EstoqueSummary[];
}

export const EstoqueTable: React.FC<EstoqueTableProps> = ({ data }) => {
  // Calcular totais
  const totals = data.reduce(
    (acc, item) => ({
      estoqueAtual: acc.estoqueAtual + item.estoqueAtual,
      pendente: acc.pendente + item.pendente,
      totalPrevisto: acc.totalPrevisto + item.totalPrevisto,
    }),
    { estoqueAtual: 0, pendente: 0, totalPrevisto: 0 }
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Negócio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comprador
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque Atual
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pendente
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Previsto
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr 
              key={`${item.comprador}-${item.negocio}-${index}`}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.negocio}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.comprador}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatCurrency(item.estoqueAtual)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatCurrency(item.pendente)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                {formatCurrency(item.totalPrevisto)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Total
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
              {formatCurrency(totals.estoqueAtual)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
              {formatCurrency(totals.pendente)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
              {formatCurrency(totals.totalPrevisto)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default EstoqueTable;
