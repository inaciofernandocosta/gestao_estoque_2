import React, { useEffect, useState } from 'react';
import { fetchStockData, fetchTotalItems, formatCurrency } from '../utils/stockCalculations';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  ArrowUpRight,
  Building2,
  Factory,
  Store
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  stat: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
  subtitle?: string;
}

interface GroupData {
  name: string;
  companies: number[];
  totalStock: number;
  totalPendingOrders: number;
}

interface GroupsResponse {
  groups: GroupData[];
  totals: {
    totalStock: number;
    totalPendingOrders: number;
  };
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, icon, isLoading = false, subtitle } = props;
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <span className="text-blue-500 bg-blue-100 rounded-full p-2">
          {icon}
        </span>
      </div>
      {isLoading ? (
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
      ) : (
        <>
          <p className="text-2xl font-bold text-gray-900 mb-2">{stat}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </>
      )}
      <p className="text-sm text-gray-500">Atualizado em tempo real</p>
    </div>
  );
}

// Função para formatar números com separador de milhares
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export default function Dashboard() {
  const [stockValue, setStockValue] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const [groupData, setGroupData] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [stockData, totalItemsData, groupsResponse] = await Promise.all([
          fetchStockData(),
          fetchTotalItems(),
          fetch('/api/stock-by-group').then(res => res.json()) as Promise<GroupsResponse>
        ]);

        setStockValue(stockData.stockValue);
        setPendingOrders(stockData.pendingOrders);
        setTotalItems(totalItemsData);
        setGroupData(groupsResponse.groups);
        
        console.log('Dados dos grupos:', groupsResponse.groups); // Log para debug
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcula o total (estoque atual + pendente)
  const totalStock = stockValue !== null && pendingOrders !== null
    ? stockValue + pendingOrders
    : null;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Valor Total em Estoque"
          stat={stockValue !== null ? formatCurrency(stockValue) : '-'}
          icon={<DollarSign className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Itens Únicos"
          stat={totalItems !== null ? formatNumber(totalItems) : '-'}
          icon={<Package className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Pedidos Pendentes"
          stat={pendingOrders !== null ? formatNumber(pendingOrders) : '-'}
          icon={<BarChart3 className="w-6 h-6" />}
          isLoading={isLoading}
        />
        <StatsCard
          title="Estoque Total Previsto"
          stat={totalStock !== null ? formatCurrency(totalStock) : '-'}
          subtitle="Estoque Atual + Pendente"
          icon={<ArrowUpRight className="w-6 h-6" />}
          isLoading={isLoading}
        />
      </div>

      {/* Tabela de Grupos */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Estoque por Grupo</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresas
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque Atual
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedidos Pendentes
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Previsto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupData.map((group, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {group.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.companies.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(group.totalStock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatNumber(group.totalPendingOrders)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(group.totalStock + group.totalPendingOrders)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
